import { ref, onMounted } from "vue";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

export function useSalvageRecords() {
    const salvageRecords = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchSalvageRecords = async () => {
        try {
            // 1. 获取 salvageRecords 集合中的所有记录
            const salvageRecordsRef = collection(db, "salvageRecord");
            const querySnapshot = await getDocs(salvageRecordsRef);

            // 临时数组，用于存储完整的 salvageRecords 数据
            const tempSalvageRecords = [];

            for (const salvageRecordDoc of querySnapshot.docs) {
                const salvageRecordData = salvageRecordDoc.data();

                const strayPetId = salvageRecordData.strayPetId;
                const uid = salvageRecordData.uid;

                // 2. 获取与 salvageRecord 关联的 strayPet 信息
                const strayPetRef = doc(db, "strayPets", strayPetId);
                const strayPetSnap = await getDoc(strayPetRef);

                let strayPetData = null;
                if (strayPetSnap.exists()) {
                    strayPetData = strayPetSnap.data();

                } else {
                    console.error(`Stray pet with ID: ${strayPetId} not found`);
                }

                // 3. 获取与 salvageRecord 关联的 user 信息 (使用 query where)
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("uid", "==", uid));
                const userQuerySnapshot = await getDocs(q);

                let userData = null;
                if (!userQuerySnapshot.empty) {
                    userData = userQuerySnapshot.docs[0].data();
                } else {
                    console.error(`User with UID: ${uid} not found`);
                }

                // 4. 将 salvageRecord、strayPet 和 user 信息组合在一起

                tempSalvageRecords.push({
                    ...salvageRecordData,
                    id: salvageRecordDoc.id,
                    strayPet: strayPetData,
                    breed: strayPetData.petBreed,
                    volunteer: userData.username,
                    method: salvageRecordData.method,
                    user: {
                        username: userData?.username,
                        role: userData?.role,
                        email: userData?.email,
                    },
                });
            }

            // 将组合后的数据存储到响应式引用 salvageRecords 中
            salvageRecords.value = tempSalvageRecords;
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    // 在组件挂载时调用 fetchSalvageRecords
    onMounted(() => {
        fetchSalvageRecords();
    });

    return {
        salvageRecords,
        loading,
        error,
    };
}
