import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc"; // útil si comparás con ISO/UTC del backend

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);

export default dayjs;