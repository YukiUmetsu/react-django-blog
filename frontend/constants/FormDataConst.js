import { string, boolean} from "yup";
import {ADMIN_USER_TABLE_COLUMNS} from "./index";

export const FORM_DATA = {
    USER_DISPLAY: {
        elements: ADMIN_USER_TABLE_COLUMNS,
        validationSchema: {
            first_name: string().required(),
            last_name: string().required(),
            email: string().email().required(),
            is_staff: boolean().required(),
            is_superuser: boolean().required(),
        },
    },
};