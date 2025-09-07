import { faker } from "@faker-js/faker";

function createRendomeCarList(){
    return{
        name:faker.vehicle.vehicle(),
        fuelType:faker.vehicle.fuel(),
        model:faker.vehicle.model(),
        type:faker.vehicle.type(),
        image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0snEbwXpvDwex2Xt9p7u2AsA8TXZZTWRs7g&s',
        miles:1000,
        gearType:'Automatic',
        price:faker.finance.amount({min:4000,max:20000})

    }
}

const carlist = faker.helpers.multiple(createRendomeCarList,{
    count:7
});

export default{
    carlist
}