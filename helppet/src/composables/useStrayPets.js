import { ref, onMounted } from "vue";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

export function useStrayPets() {
    const strayPets = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchStrayPets = async () => {
        try {
            // 1. 获取所有 strayPets 集合中的数据
            const strayPetsRef = collection(db, "strayPets");
            const querySnapshot = await getDocs(strayPetsRef);

            // 临时数组，用于存储宠物数据和用户信息
            const tempStrayPets = [];


            for (const strayPetDoc of querySnapshot.docs) {
                const strayPetData = strayPetDoc.data();

                const uid = strayPetData.uid;

                // 2. 根据每个 strayPet 的 uid 查询 users 集合中的用户数据
                const userSnap = await getDocs(
                    query(collection(db, "users"), where("uid", "==", uid)));



                if (userSnap.docs.length > 0) {
                    const userData = userSnap.docs[0].data();

                    // 3. 将 strayPet 数据和 user 数据组合在一起
                    tempStrayPets.push({
                        ...strayPetData,
                        id: strayPetDoc.id,
                        user: {
                            username: userData.username,
                            role: userData.role,
                            email: userData.email,
                        },
                        explorer: userData.username
                    });
                } else {
                    console.error(`User with UID: ${uid} not found`);
                }
            }

            // 将数据存储到响应式引用 strayPets 中
            strayPets.value = tempStrayPets;
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchStrayPets();
    });

    return {
        strayPets,
        loading,
        error,
    };
}
