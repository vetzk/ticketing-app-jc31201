import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export class ProfileController {
  async getProfileUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (res.locals.decrypt.id) {
        const findUser = await prisma.userprofile.findUnique({
          where: {
            id: res.locals.decrypt.id,
          },
        });

        if (!findUser) {
          return res.status(404).send({
            success: false,
            message: 'User not found',
          });
        }
      }
      const profile = await prisma.userprofile.findMany({
        where: { userId: res.locals.decrypt.id },
        select: {
          fullName: true,
          address: true,
          dateOfBirth: true,
          location: {
            select: {
              locationName: true,
            },
          },
        },
      });
      return res.status(200).send({
        success: true,
        result: profile,
      });
    } catch (error) {
      next({ success: false, message: 'Failed to get your information' });
    }
  }
  async addProfileUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { address, dateOfBirth, fullName, location } = req.body;

      console.log(res.locals.decrypt);

      if (res.locals.decrypt.id) {
        const findUser = await prisma.user.findUnique({
          where: {
            id: res.locals.decrypt.id,
          },
        });

        if (!findUser) {
          return res.status(404).send({
            succesS: false,
            message: 'Profile not found',
          });
        }
        const findLocation = await prisma.location.findFirst({
          where: {
            locationName: location,
          },
        });

        if (findLocation) {
          const createProfile = await prisma.userprofile.create({
            data: {
              userId: findUser.id,
              address,
              dateOfBirth: new Date(dateOfBirth).toISOString(),
              fullName,
              image: `/assets/profile/${req.file?.filename}`,
              locationId: findLocation?.id,
            },
          });

          return res.status(200).send({
            success: true,
            message: 'successfully add your profile',
            result: createProfile,
          });
        } else {
          const createLocation = await prisma.location.create({
            data: {
              locationName: location,
            },
          });

          const createProfile = await prisma.userprofile.create({
            data: {
              userId: findUser.id,
              address: address,
              dateOfBirth: new Date(dateOfBirth).toISOString(),
              fullName: fullName,
              locationId: createLocation.id,
            },
          });

          return res.status(200).send({
            success: true,
            message: 'successfully add your profile',
            result: createProfile,
          });
        }
      } else {
        return res.status(404).send({
          success: false,
          message: 'Token not found',
          result: res.locals.decrypt.id,
        });
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error,
      });
    }
  }
  async updateProfileUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (res.locals.decrypt.id) {
        const { address, fullName, dateOfBirth } = req.body;

        const findUser = await prisma.userprofile.findFirst({
          where: {
            userId: res.locals.decrypt.id,
          },
        });

        if (findUser?.image) {
          const oldImagePath = path.join(
            __dirname,
            '../../public',
            findUser.image,
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        const updatedProfile = await prisma.userprofile.update({
          data: {
            address: address ? address : findUser?.address,
            fullName: fullName ? fullName : findUser?.fullName,
            dateOfBirth: dateOfBirth
              ? new Date(dateOfBirth).toISOString()
              : findUser?.dateOfBirth,
            image: req.file
              ? `/assets/profile/${req.file?.filename}`
              : findUser?.image,
          },
          where: {
            id: findUser?.id,
          },
        });

        return res.status(200).send({
          success: false,
          message: 'Profile updated succesfully',
          result: updatedProfile,
        });
      }
    } catch (error) {
      next({
        success: false,
        message: 'Cannot update your profile',
        error,
      });
    }
  }
}
