import faker from "faker";  // dev dependency
import { Factory } from "rosie"; // dev dependency

export const createUserData = (listNumber) => {
    const personFactory = Factory.define("person")
        .attr("profile_img", "http://localhost:8000/media/uploads/2020/04/05/yuki-profile.jpg")
        .attr("first_name", faker.name.firstName)
        .attr("last_name", faker.name.lastName)
        .attr("is_staff", faker.random.boolean)
        .attr("is_superuser", faker.random.boolean)
        .attr("email", faker.internet.email)
        .attr("created_at", faker.date.past);

    const dataFactory = Factory.define("data")
        .sequence("id")
        .extend(personFactory);

    return dataFactory.buildList(listNumber);
};