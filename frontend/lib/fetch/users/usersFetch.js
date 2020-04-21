import Fetch from "../../fetch";
import {USERS_LIST_API} from "../../../constants";

export const fetchUsers = async () => {
    const fetchObj = new Fetch(USERS_LIST_API);
    return await fetchObj.start();
};