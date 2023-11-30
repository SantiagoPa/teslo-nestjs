import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  private readonly bcrypt = bcrypt;

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.deleteTables();
    const user = await this.inserNewUsers();
    await this.insertNewProducts(user);
    return `SEED EXECUTE`;
  }

  private async deleteTables(){
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
            .delete()
            .where({})
            .execute();
  }

  private async inserNewUsers(){
    const seedUsers = initialData.users;
    const users: User[] = [];

    const proccessSeedUsers = seedUsers.map((user)=>{
      users.push( this.userRepository.create( user ) );
      const { password, ...restUser } = user;
      return { ...restUser, password: this.bcrypt.hashSync(password, 10)  }
    });

    const userDB = await this.userRepository.save( proccessSeedUsers );

    return userDB[0]
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push( this.productsService.create(product, user) )
    });

    await Promise.all( insertPromises );

    return true;
  }
}
