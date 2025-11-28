import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc"; // útil si comparás con ISO/UTC del backend

//Fechas en español
import localeEs from "dayjs/locale/es";

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);

dayjs.locale(localeEs);

export default dayjs;