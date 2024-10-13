
import { ref, onMounted } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

export function useUserData() {
    const userData = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const uid = localStorage.getItem("uid");

    const fetchUserData = async () => {

        if (!uid) {
            error.value = "No UID found in localStorage";
            loading.value = false;
            return;
        }

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                userData.value = querySnapshot.docs[0].data();
            } else {
                error.value = "User data not found";
            }
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchUserData();
    });

    return {
        userData,
        loading,
        error
    };
}
