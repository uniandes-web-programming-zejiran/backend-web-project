/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PagoEntity } from './pago.entity';
import { PagoService } from './pago.service';

import { faker } from '@faker-js/faker';
import { PedidoEntity } from '../pedido/pedido.entity';

describe('PagoService', () => {
  let service: PagoService;
  let repository: Repository<PagoEntity>;
  let pagosList: PagoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PagoService],
    }).compile();

    service = module.get<PagoService>(PagoService);
    repository = module.get<Repository<PagoEntity>>(
      getRepositoryToken(PagoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pagosList = [];
    for (let i = 0; i < 5; i++) {
      const pago: PagoEntity = await repository.save({
        monto: faker.datatype.number(),
        pagado: faker.datatype.boolean(),
      });
      pagosList.push(pago);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los pagos', async () => {
    const pagos: PagoEntity[] = await service.findAll();
    expect(pagos).not.toBeNull();
    expect(pagos).toHaveLength(pagosList.length);
  });

  it('findOne deberia retornar el pago por id', async () => {
    const storedPago: PagoEntity = pagosList[0];
    const pago: PagoEntity = await service.findOne(storedPago.id);
    expect(pago).not.toBeNull();
    expect(pago.monto).toEqual(storedPago.monto);
    expect(pago.pagado).toEqual(storedPago.pagado);
 
  });

  it('findOne deberia mandar exception para un pago invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El pago con el id dado no fue encontrado',
    );
  });

  it('create deberia retornar un pago', async () => {
    const pago: PagoEntity = {
        id: '',
        monto: faker.datatype.number(),
        pagado: faker.datatype.boolean(),
        pedido: new PedidoEntity
    };

    const newPago: PagoEntity = await service.create(pago);
    expect(newPago).not.toBeNull();

    const storedPago: PagoEntity = await repository.findOne({
      where: { id: newPago.id },
    });
    expect(pago).not.toBeNull();
    expect(pago.monto).toEqual(storedPago.monto);
    expect(pago.pagado).toEqual(storedPago.pagado);
  });

  it('update deberia modificar un pago', async () => {
    const pago: PagoEntity = pagosList[0];
    pago.monto = faker.datatype.number();

    const updatedPago: PagoEntity = await service.update(pago.id, pago);
    expect(updatedPago).not.toBeNull();

    const storedPago: PagoEntity = await repository.findOne({
      where: { id: pago.id },
    });
    expect(storedPago).not.toBeNull();
    expect(storedPago.monto).toEqual(pago.monto);
  });

  it('update deberia mandar exception si el pago no es valido', async () => {
    let pago: PagoEntity = pagosList[0];
    pago = {
      ...pago,
      monto : faker.datatype.number(),
    };
    await expect(() => service.update('0', pago)).rejects.toHaveProperty(
      'message',
      'El pago con el id dado no fue encontrado',
    );
  });

  it('delete deberia remover un pago', async () => {
    const pago: PagoEntity = pagosList[0];
    await service.delete(pago.id);

    const deletedPago: PagoEntity = await repository.findOne({
      where: { id: pago.id },
    });
    expect(deletedPago).toBeNull();
  });

  it('delete deberia mandar exception para un pago invalido', async () => {
    const pago: PagoEntity = pagosList[0];
    await service.delete(pago.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El pago con el id dado no fue encontrado',
    );
  });
});
