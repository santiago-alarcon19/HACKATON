-- Seed data from tractor-store blueprint

INSERT INTO catalog_store (id, name, street, city, image) VALUES
  ('store-a', 'Aurora Flagship Store', 'Astronaut Way 1', 'Arlington', '/cdn/img/store/[size]/store-1.webp'),
  ('store-b', 'Big Micro Machines', 'Broadway 2', 'Burlington', '/cdn/img/store/[size]/store-2.webp'),
  ('store-c', 'Central Mall', 'Clown Street 3', 'Cryo', '/cdn/img/store/[size]/store-3.webp'),
  ('store-d', 'Downtown Model Store', 'Duck Street 4', 'Davenport', '/cdn/img/store/[size]/store-4.webp');

INSERT INTO catalog_teaser (title, image, url, sort_order) VALUES
  ('Classic Tractors', '/cdn/img/scene/[size]/classics.webp', '/products/classic', 0),
  ('Autonomous Tractors', '/cdn/img/scene/[size]/autonomous.webp', '/products/autonomous', 1);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('AU-01', 'TerraFirma AutoCultivator T-300', 'autonomous', ARRAY['Precision GPS mapping optimizes field coverage.', 'Hybrid engine ensures eco-friendly extended operation.', 'Fully autonomous with smart obstacle detection and terrain adaptation.']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-01-SI', 'AU-01', 'Silver', '/cdn/img/product/[size]/AU-01-SI.webp', '#C0C0C0', 1000);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-01-SI', 0);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('AU-02', 'SmartFarm Titan', 'autonomous', ARRAY['Advanced autopilot technology for precise farming operations.', 'Eco-friendly solar-assisted power system for sustainable use.', 'Intelligent AI for real-time field analysis and automated adjustments.']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-02-OG', 'AU-02', 'Sunset Copper', '/cdn/img/product/[size]/AU-02-OG.webp', '#dd5219', 4100);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-02-OG', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-02-BL', 'AU-02', 'Cosmic Sapphire', '/cdn/img/product/[size]/AU-02-BL.webp', '#2A52BE', 4000);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-02-BL', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-02-GG', 'AU-02', 'Verdant Shadow', '/cdn/img/product/[size]/AU-02-GG.webp', '#005A04', 4000);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-02-GG', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('AU-03', 'FutureHarvest Navigator', 'autonomous', ARRAY['Autonomous navigation with sub-inch accuracy', 'Solar-enhanced hybrid powertrain for extended operation', 'Real-time crop and soil health analytics']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-03-TQ', 'AU-03', 'Turquoise Titan', '/cdn/img/product/[size]/AU-03-TQ.webp', '#169fb8', 1600);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-03-TQ', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-03-PL', 'AU-03', 'Majestic Violet', '/cdn/img/product/[size]/AU-03-PL.webp', '#9B5FC0', 1700);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-03-PL', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-03-RD', 'AU-03', 'Scarlet Dynamo', '/cdn/img/product/[size]/AU-03-RD.webp', '#FF2400', 1900);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-03-RD', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-03-YE', 'AU-03', 'Sunbeam Yellow', '/cdn/img/product/[size]/AU-03-YE.webp', '#faad00', 1800);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-03-YE', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('AU-04', 'Sapphire Sunworker 460R', 'autonomous', ARRAY['Next-generation autonomous guidance system for seamless operation', 'High-capacity energy storage for all-day work without recharge', 'Advanced analytics suite for precision soil and plant health management']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-04-RD', 'AU-04', 'Ruby Red', '/cdn/img/product/[size]/AU-04-RD.webp', '#9B111E', 8700);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-04-RD', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-04-BK', 'AU-04', 'Midnight Onyx', '/cdn/img/product/[size]/AU-04-BK.webp', '#353839', 8500);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-04-BK', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('AU-05', 'EcoGrow Crop Commander', 'autonomous', ARRAY['Ultra-precise field navigation technology', 'Dual-mode power system for maximum uptime', 'On-the-go field data analysis for smart farming decisions']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-05-ZH', 'AU-05', 'Zestful Horizon', '/cdn/img/product/[size]/AU-05-ZH.webp', '#FFA07A', 3400);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-05-ZH', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('AU-06', 'FarmFleet Sovereign', 'autonomous', ARRAY['Robust all-terrain adaptability for diverse farm landscapes', 'High-efficiency energy matrix for longer field endurance', 'Integrated crop management system with advanced diagnostics']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-06-CZ', 'AU-06', 'Canary Zenith', '/cdn/img/product/[size]/AU-06-CZ.webp', '#FFD700', 2200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-06-CZ', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-06-MT', 'AU-06', 'Minted Jade', '/cdn/img/product/[size]/AU-06-MT.webp', '#628882', 2100);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-06-MT', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('AU-07', 'Verde Voyager', 'autonomous', ARRAY['Adaptive drive system intelligently navigates through diverse field conditions', 'Clean energy operation with advanced solar battery technology', 'High-resolution field scanners for precise agronomy insights']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-07-MT', 'AU-07', 'Glacial Mint', '/cdn/img/product/[size]/AU-07-MT.webp', '#AFDBD2', 4000);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-07-MT', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-07-YE', 'AU-07', 'Sunbeam Yellow', '/cdn/img/product/[size]/AU-07-YE.webp', '#FFDA03', 5000);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-07-YE', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('AU-08', 'Field Pioneer', 'autonomous', ARRAY['Automated field traversal with intelligent pathfinding algorithms', 'Eco-friendly electric motors paired with high-capacity batteries', 'Real-time environmental monitoring for optimal crop growth']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('AU-08-WH', 'AU-08', 'Polar White', '/cdn/img/product/[size]/AU-08-WH.webp', '#E8E8E8', 4500);
INSERT INTO inventory_stock (sku, quantity) VALUES ('AU-08-WH', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-01', 'Heritage Workhorse', 'classic', ARRAY['Proven reliability with a touch of modern reliability enhancements', 'Robust construction equipped to withstand decades of labor', 'User-friendly operation with traditional manual controls']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-01-GR', 'CL-01', 'Verdant Field', '/cdn/img/product/[size]/CL-01-GR.webp', '#6B8E23', 5700);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-01-GR', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-01-GY', 'CL-01', 'Stormy Sky', '/cdn/img/product/[size]/CL-01-GY.webp', '#708090', 6200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-01-GY', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-02', 'Falcon Crest Farm', 'classic', ARRAY['Rugged simplicity meets classic design', 'Built-to-last machinery for reliable fieldwork', 'Ease of control with straightforward mechanical systems']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-02-BL', 'CL-02', 'Cerulean Classic', '/cdn/img/product/[size]/CL-02-BL.webp', '#007BA7', 2600);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-02-BL', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-03', 'Falcon Crest Work', 'classic', ARRAY['Vintage engineering with a legacy of durability', 'Powerful yet simple mechanics for easy operation and repair', 'Classic aesthetics with a robust body, built to last']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-03-GR', 'CL-03', 'Meadow Green', '/cdn/img/product/[size]/CL-03-GR.webp', '#7CFC00', 2300);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-03-GR', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-03-PI', 'CL-03', 'Rustic Rose', '/cdn/img/product/[size]/CL-03-PI.webp', '#b50018', 2300);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-03-PI', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-03-YE', 'CL-03', 'Harvest Gold', '/cdn/img/product/[size]/CL-03-YE.webp', '#DA9100', 2300);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-03-YE', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-04', 'Broadfield Majestic', 'classic', ARRAY['Built with the robust heart of early industrial workhorses', 'Simplified mechanics for unparalleled ease of use and maintenance', 'A testament to early agricultural machinery with a dependable engine']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-04-BL', 'CL-04', 'Oceanic Blue', '/cdn/img/product/[size]/CL-04-BL.webp', '#0040a6', 2200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-04-BL', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-04-RD', 'CL-04', 'Rustic Crimson', '/cdn/img/product/[size]/CL-04-RD.webp', '#7B3F00', 2200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-04-RD', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-04-TQ', 'CL-04', 'Aqua Green', '/cdn/img/product/[size]/CL-04-TQ.webp', '#00b298', 2200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-04-TQ', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-05', 'Countryside Commander', 'classic', ARRAY['Reliable performance with time-tested engineering', 'Rugged design for efficient operation across all types of terrain', 'Classic operator comfort with modern ergonomic enhancements']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-05-PT', 'CL-05', 'Pacific Teal', '/cdn/img/product/[size]/CL-05-PT.webp', '#479da8', 2700);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-05-PT', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-05-RD', 'CL-05', 'Barn Red', '/cdn/img/product/[size]/CL-05-RD.webp', '#7C0A02', 2700);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-05-RD', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-06', 'Danamark Steadfast', 'classic', ARRAY['Engineered for the meticulous demands of Danish agriculture', 'Sturdy chassis and reliable mechanics for longevity', 'Utilitarian design with practical functionality and comfort']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-06-MT', 'CL-06', 'Emerald Forest', '/cdn/img/product/[size]/CL-06-MT.webp', '#46f5bb', 2800);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-06-MT', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-06-YE', 'CL-06', 'Golden Wheat', '/cdn/img/product/[size]/CL-06-YE.webp', '#faaf3f', 2800);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-06-YE', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-07', 'Greenland Rover', 'classic', ARRAY['Engineered to tackle the diverse European terrain with ease', 'Sturdy and reliable mechanics known for their longevity', 'Ergonomically designed for comfort during long working hours']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-07-GR', 'CL-07', 'Forest Fern', '/cdn/img/product/[size]/CL-07-GR.webp', '#2ea250', 2900);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-07-GR', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-07-YE', 'CL-07', 'Autumn Amber', '/cdn/img/product/[size]/CL-07-YE.webp', '#FFBF00', 2900);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-07-YE', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-08', 'Holland Hamster', 'classic', ARRAY['Dutch craftsmanship for precision and quality', 'Optimized for tulip fields and versatile European landscapes', 'Ergonomic design with a focus on operator comfort and efficiency']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-08-GR', 'CL-08', 'Polder Green', '/cdn/img/product/[size]/CL-08-GR.webp', '#C2B280', 7750);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-08-GR', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-08-PI', 'CL-08', 'Tulip Magenta', '/cdn/img/product/[size]/CL-08-PI.webp', '#D65282', 7900);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-08-PI', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-09', 'TerraFirma Veneto', 'classic', ARRAY['Elegant Italian design with sleek lines and a vibrant aesthetic', 'Precision mechanics for vineyard and orchard maneuverability', 'Comfort-focused design with a flair for the dramatic']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-09-BL', 'CL-09', 'Adriatic Blue', '/cdn/img/product/[size]/CL-09-BL.webp', '#2f6ea3', 2950);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-09-BL', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-09-GR', 'CL-09', 'Tuscan Green', '/cdn/img/product/[size]/CL-09-GR.webp', '#518b2b', 2950);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-09-GR', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-10', 'Global Gallant', 'classic', ARRAY['Retro design with a nod to the golden era of farming', 'Engine robustness that stands the test of time', 'Functional simplicity for ease of operation in any region']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-10-SD', 'CL-10', 'Sahara Dawn', '/cdn/img/product/[size]/CL-10-SD.webp', '#b8a875', 2600);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-10-SD', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-10-VI', 'CL-10', 'Violet Vintage', '/cdn/img/product/[size]/CL-10-VI.webp', '#8A2BE2', 2600);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-10-VI', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-11', 'Scandinavia Sower', 'classic', ARRAY['Authentic Swedish engineering for optimal cold-climate performance', 'Sturdy build and mechanics for lifelong reliability', 'Iconic design reflecting the simplicity and efficiency of Scandinavian style']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-11-SK', 'CL-11', 'Baltic Blue', '/cdn/img/product/[size]/CL-11-SK.webp', '#95c1f4', 3100);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-11-SK', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-11-YE', 'CL-11', 'Nordic Gold', '/cdn/img/product/[size]/CL-11-YE.webp', '#FFD700', 3100);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-11-YE', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-12', 'Celerity Cruiser', 'classic', ARRAY['A speedster in the classic tractor segment, unparalleled in quick task completion', 'Sleek design with aerodynamic contours for reduced drag', 'Enhanced gearbox for smooth acceleration and nimble handling']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-12-BL', 'CL-12', 'Velocity Blue', '/cdn/img/product/[size]/CL-12-BL.webp', '#1E90FF', 3200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-12-BL', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-12-RD', 'CL-12', 'Rally Red', '/cdn/img/product/[size]/CL-12-RD.webp', '#ED2939', 3200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-12-RD', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-13', 'Rapid Racer', 'classic', ARRAY['Streamlined design for faster field operations', 'Optimized gear ratios for efficient power transmission', 'Advanced air flow system for superior engine cooling']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-13-BL', 'CL-13', 'Speedway Blue', '/cdn/img/product/[size]/CL-13-BL.webp', '#2679a6', 7500);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-13-BL', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-13-RD', 'CL-13', 'Raceway Red', '/cdn/img/product/[size]/CL-13-RD.webp', '#CF1020', 7500);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-13-RD', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-14', 'Caribbean Cruiser', 'classic', ARRAY['Robust construction for enduring performance', 'Time-tested design with a proven track record', 'Easy-to-service mechanics for long-term reliability']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-14-GR', 'CL-14', 'Emerald Grove', '/cdn/img/product/[size]/CL-14-GR.webp', '#57ae13', 2300);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-14-GR', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-14-RD', 'CL-14', 'Ruby Fields', '/cdn/img/product/[size]/CL-14-RD.webp', '#cd2b1e', 2300);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-14-RD', 25);

INSERT INTO catalog_product (id, name, category, highlights) VALUES ('CL-15', 'Fieldmaster Classic', 'classic', ARRAY['Timeless design with a focus on comfort and control', 'Efficient fuel consumption with a powerful engine', 'Versatile functionality for all types of agricultural work']);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-15-PI', 'CL-15', 'Vintage Pink', '/cdn/img/product/[size]/CL-15-PI.webp', '#e1949e', 6200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-15-PI', 25);
INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('CL-15-SD', 'CL-15', 'Sahara Dust', '/cdn/img/product/[size]/CL-15-SD.webp', '#dec78c', 6200);
INSERT INTO inventory_stock (sku, quantity) VALUES ('CL-15-SD', 25);

