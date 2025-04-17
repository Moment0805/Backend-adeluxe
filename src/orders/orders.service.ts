/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notification.service';
import { OrderItemDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: number, items: OrderItemDto[]) {
    const order = await this.prisma.order.create({
      data: {
        userId,
        items: {
          create: items.map((item) => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // ✅ Send notification to the user
    if (user?.email) {
      await this.notificationsService.sendEmail(
        user.email,
        'Order Placed Successfully ✅',
        `<p>Hi ${user.email},</p><p>Your order has been received. Thank you!</p>`,
      );
    }

    if (user?.phone) {
      await this.notificationsService.sendSms(
        user.phone,
        `Hello! Your order has been placed successfully.`,
      );
    }

    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId: Number(userId) },
      include: {
        items: true,
      },
    });
  }
}
