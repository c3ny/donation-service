import { NestFactory } from '@nestjs/core';
import { AppModule } from '../donation.module';
import { getModelToken } from '@nestjs/mongoose';
import { Donation } from '../adapters/out/domain/donation.entity';

/**
 * Migration script to add createdAt timestamps to existing donation documents
 * that don't have them. This ensures consistent pagination sorting.
 *
 * Run this script after deploying the updated schema with timestamps.
 */
async function migrateDonationTimestamps() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const donationModel = app.get(getModelToken(Donation.name));

    console.log(
      'Starting migration: Adding createdAt timestamps to existing donations...',
    );

    // Find all documents without createdAt field
    const documentsWithoutCreatedAt = await donationModel
      .find({
        createdAt: { $exists: false },
      })
      .exec();

    console.log(
      `Found ${documentsWithoutCreatedAt.length} documents without createdAt field`,
    );

    if (documentsWithoutCreatedAt.length === 0) {
      console.log('No documents need migration. Exiting...');
      return;
    }

    // Update documents to add createdAt based on _id timestamp
    // MongoDB ObjectId contains timestamp information
    const bulkOps = documentsWithoutCreatedAt.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            createdAt: doc._id.getTimestamp(),
            updatedAt: doc._id.getTimestamp(),
          },
        },
      },
    }));

    // Execute bulk update
    const result = await donationModel.bulkWrite(bulkOps);

    console.log(`Migration completed successfully:`);
    console.log(`- Modified ${result.modifiedCount} documents`);
    console.log(`- Matched ${result.matchedCount} documents`);

    // Verify the migration
    const remainingWithoutCreatedAt = await donationModel.countDocuments({
      createdAt: { $exists: false },
    });

    if (remainingWithoutCreatedAt === 0) {
      console.log('✅ All documents now have createdAt timestamps');
    } else {
      console.log(
        `⚠️  Warning: ${remainingWithoutCreatedAt} documents still missing createdAt`,
      );
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDonationTimestamps()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateDonationTimestamps };
