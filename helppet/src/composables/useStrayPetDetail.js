import { ref, onMounted } from "vue";
import { collection, getDoc, doc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

export function useStrayPetDetail(id) {
    const strayPet = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const fetchStrayPetDetail = async () => {
        try {
            // 1. 获取特定ID的strayPet数据
            const strayPetDoc = await getDoc(doc(db, "strayPets", id));

            if (strayPetDoc.exists()) {
                const strayPetData = strayPetDoc.data();

                const uid = strayPetData.uid;

                // 2. 根据uid查询users集合中的用户数据
                const userSnap = await getDocs(
                    query(collection(db, "users"), where("uid", "==", uid))
                );

                if (userSnap.docs.length > 0) {
                    const userData = userSnap.docs[0].data();
                    // 3. 将strayPet数据与user数据组合在一起
                    strayPet.value = {
                        id: strayPetDoc.id,
                        ...strayPetData,
                        user: {
                            username: userData.username,
                        },
                    };
                } else {
                    console.error(`User with UID: ${uid} not found`);
                }

                const salvageRecordSnap = await getDocs(
                    query(collection(db, 'salvageRecord'), where("strayPetId", "==", id)
                    ));

                let salvageRecords = salvageRecordSnap.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    }
                });

                const salvageUsers = await Promise.all(
                    salvageRecords.map(async record => {
                        const userSnap = await getDocs(
                            query(collection(db, "users"), where("uid", "==", record.uid))
                        );
                        if (userSnap.docs.length > 0) {
                            const userData = userSnap.docs[0].data();
                            return {
                                ...record,
                                volunteer: {
                                    username: userData.username,
                                },
                            };
                        } else {
                            console.error(`User with UID: ${record.uid} not found`);
                        }
                    })
                );
                salvageRecords = salvageRecords.map((record, index) => {
                    return {
                        ...record,
                        ...salvageUsers[index]
                    }
                });
                console.log(salvageRecords)
                strayPet.value.salvageRecords = salvageRecords;
            } else {
                throw new Error(`Stray Pet with ID: ${id} not found`);
            }
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchStrayPetDetail();
    });

    return {
        strayPet,
        loading,
        error,
    };
}
