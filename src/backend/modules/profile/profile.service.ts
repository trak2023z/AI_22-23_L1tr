import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AddWalletDto } from './dto/addWallet.dto';
import { GetUserBuyOfferQuery } from './dto/getUserBuyOffer.query';
import { GetUserSellOfferQuery } from './dto/getUserSellOffer.query';
import { GetUserStockQuery } from './dto/getUserStock.query';
import { UpdateUserDto } from './dto/updateUser.dto';
import { OrderByForUserStock } from './enum/orderByForUserStock.enum';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  getUserProfile(userId: number) {
    return this.prisma.user.findFirstOrThrow({
      where: {
        userId,
      },
      select: {
        userId: true,
        email: true,
        name: true,
        surname: true,
        balanceCents: true,
      },
    });
  }

  async getUserStock(userId: number, getUserStockQuery: GetUserStockQuery) {
    let orderByPriceCents;
    if(getUserStockQuery.orderBy === 'priceCents'){
      getUserStockQuery.orderBy = OrderByForUserStock.userStockId
      orderByPriceCents = true;
    }

    const results = await this.prisma.userStock.findMany({
      take: getUserStockQuery.take,
      skip: getUserStockQuery.skip,
      orderBy: {
        [getUserStockQuery.orderBy]: getUserStockQuery.orderType,
      },
      where: {
        userId,
        Company: {
          name: {
            contains: getUserStockQuery.companyName,
            mode: 'insensitive',
          },
        },
      },
      select: {
        userStockId: true,
        stockQuantity: true,
        Company: {
          select: {
            companyId: true,
            name: true,
            description: true,
            UserStock: {
              select: {
                SellOffer: {
                  select: {
                    quantity: true,
                    unitSellPriceCents: true,
                  },
                  where: {
                    status: 0,
                    userId,
                  },
                },
              },
            },
          },
        },
      },
    });

    const userStockWithPriceCents = results.map((result) => {
      return {
        ...result,
        priceCents:
          result.Company.UserStock.length > 0
            ? Math.min(
              ...result.Company.UserStock.flatMap((us) => 
                us.SellOffer.map((so) => so.unitSellPriceCents),
              ),
            )
          : 0
      };
    });

    if (orderByPriceCents) {
      userStockWithPriceCents.sort((a,b) => {
        const sortOrder = getUserStockQuery.orderType === 'asc' ? 1: -1
        const result = (a.priceCents < b.priceCents) ? -1 : (a.priceCents > b.priceCents) ? 1 : 0;
        return result * sortOrder;
      })
    }

    return userStockWithPriceCents;
  }

  getUserSellOffers(
    userId: number,
    getUserSellOfferQuery: GetUserSellOfferQuery,
  ) {
    return this.prisma.sellOffer.findMany({
      take: getUserSellOfferQuery.take,
      skip: getUserSellOfferQuery.skip,
      orderBy: {
        [getUserSellOfferQuery.orderBy]: getUserSellOfferQuery.orderType,
      },
      where: {
        userId,
        status: getUserSellOfferQuery.status,
        UserStock: {
          Company: {
            name: {
              contains: getUserSellOfferQuery.companyName,
              mode: 'insensitive',
            },
          },
        },
      },
      select: {
        sellOfferId: true,
        userStockId: true,
        unitSellPriceCents: true,
        quantity: true,
        created: true,
        status: true,
        UserStock: {
          select: {
            Company: {
              select: {
                companyId: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  getUserBuyOffers(userId: number, getUserBuyOfferQuery: GetUserBuyOfferQuery) {
    return this.prisma.buyOffer.findMany({
      take: getUserBuyOfferQuery.take,
      skip: getUserBuyOfferQuery.skip,
      orderBy: {
        [getUserBuyOfferQuery.orderBy]: getUserBuyOfferQuery.orderType,
      },
      where: {
        userId,
        status: getUserBuyOfferQuery.status,
        Company: {
          name: {
            contains: getUserBuyOfferQuery.companyName,
            mode: 'insensitive',
          },
        },
      },
      select: {
        buyOfferId: true,
        companyId: true,
        unitBuyPriceCents: true,
        quantity: true,
        created: true,
        status: true,
        Company: {
          select: {
            companyId: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  updateUserAccount(userId: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        userId,
      },
      data: updateUserDto,
      select: {
        userId: true,
      },
    });
  }

  addWallet(userId: number, addWalletDto: AddWalletDto) {
    return this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        balanceCents: {
          increment: addWalletDto.amountCents,
        },
      },
      select: {
        userId: true,
      },
    });
  }

  getUserWaller(userId: number) {
    return this.prisma.user.findFirst({
      where: {
        userId,
      },
      select: {
        balanceCents: true,
      },
    });
  }
}
