import mongoose from 'mongoose';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Product from '../models/product.model.js';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Product Model', () => {
  before(async () => {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    // Clear the Product collection after each test
    await Product.deleteMany({});
  });

  after(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.connection.close();
  });

  describe('#findById()', () => {
    it('should return a product by ID', async () => {
      // Create a new product
      const newProduct = await Product.create({
        name: 'Test Product',
        price: 9.99,
        description: 'Test description',
        category: 'Test category',
        rating: 4.5,
        supply: 10,
      });

      // Retrieve the product by ID
      const foundProduct = await Product.findById(newProduct._id);

      // Assert that the found product matches the created product
      expect(foundProduct).to.be.an('object');
      expect(foundProduct.name).to.equal('Test Product');
      // Add more assertions as needed
    });
  });

  describe('#findAll()', () => {
    it('should return all products', async () => {
      // Create some test products
      await Product.create([
        {
          name: 'Product 1',
          price: 9.99,
          description: 'Description 1',
          category: 'Category 1',
          rating: 4.5,
          supply: 10,
        },
        {
          name: 'Product 2',
          price: 19.99,
          description: 'Description 2',
          category: 'Category 2',
          rating: 4.0,
          supply: 5,
        },
      ]);

      // Retrieve all products
      const allProducts = await Product.find();

      // Assert that the returned products array is not empty
      expect(allProducts).to.be.an('array');
      expect(allProducts).to.have.lengthOf.at.least(2);
      // Add more assertions as needed
    });
  });
});
