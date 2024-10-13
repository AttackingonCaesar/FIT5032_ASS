import { ref, onMounted } from "vue";
import { collection, getDoc, doc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

export function useSalvageRecordDetail(id) {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const fetchData = async () => {
        try {

            const dataDoc = await getDoc(doc(db, "salvageRecord", id));

            if (dataDoc.exists()) {
                const dataItem = dataDoc.data();

                const uid = dataItem.uid;

                const strayPetRef = doc(db, "strayPets", dataItem.strayPetId);
                const strayPetSnap = await getDoc(strayPetRef);



                // 2. 根据uid查询users集合中的用户数据
                const userSnap = await getDocs(
                    query(collection(db, "users"), where("uid", "==", uid))
                );

                if (userSnap.docs.length > 0) {
                    const userData = userSnap.docs[0].data();
                    // 3. 将strayPet数据与user数据组合在一起
                    data.value = {
                        ...dataItem,
                        id: dataDoc.id,
                        strayPet: strayPetSnap.data(),
                        user: {
                            username: userData.username,
                        },
                    };
                } else {
                    console.error(`User with UID: ${uid} not found`);
                }
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
        fetchData()
    });

    return {
        salvageRecord: data,
        loading,
        error,
    };
}
