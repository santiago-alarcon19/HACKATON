-- Catalog module
CREATE TABLE catalog_store (
    id          VARCHAR(64) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    street      VARCHAR(255) NOT NULL,
    city        VARCHAR(255) NOT NULL,
    image       VARCHAR(512) NOT NULL
);

CREATE TABLE catalog_teaser (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    image       VARCHAR(512) NOT NULL,
    url         VARCHAR(255) NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE catalog_product (
    id          VARCHAR(16) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    category    VARCHAR(32) NOT NULL,
    highlights  TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE catalog_variant (
    sku         VARCHAR(32) PRIMARY KEY,
    product_id  VARCHAR(16) NOT NULL REFERENCES catalog_product(id),
    name        VARCHAR(128) NOT NULL,
    image       VARCHAR(512) NOT NULL,
    color       VARCHAR(16) NOT NULL,
    price       INT NOT NULL
);

CREATE INDEX idx_catalog_variant_product ON catalog_variant(product_id);
CREATE INDEX idx_catalog_product_category ON catalog_product(category);

-- Inventory module
CREATE TABLE inventory_stock (
    sku         VARCHAR(32) PRIMARY KEY,
    quantity    INT NOT NULL CHECK (quantity >= 0)
);

-- Cart module
CREATE TABLE cart_session (
    id          UUID PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_item (
    id          BIGSERIAL PRIMARY KEY,
    session_id  UUID NOT NULL REFERENCES cart_session(id) ON DELETE CASCADE,
    sku         VARCHAR(32) NOT NULL,
    quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    UNIQUE (session_id, sku)
);

CREATE INDEX idx_cart_item_session ON cart_item(session_id);

-- Order module
CREATE TABLE order_order (
    id              UUID PRIMARY KEY,
    store_id        VARCHAR(64) NOT NULL,
    firstname       VARCHAR(128) NOT NULL,
    lastname        VARCHAR(128) NOT NULL,
    total           INT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_line_item (
    id          BIGSERIAL PRIMARY KEY,
    order_id    UUID NOT NULL REFERENCES order_order(id) ON DELETE CASCADE,
    sku         VARCHAR(32) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    image       VARCHAR(512) NOT NULL,
    price       INT NOT NULL,
    quantity    INT NOT NULL
);

CREATE INDEX idx_order_line_item_order ON order_line_item(order_id);

-- Notifications module (order confirmation audit)
CREATE TABLE notifications_log (
    id          BIGSERIAL PRIMARY KEY,
    order_id    UUID NOT NULL,
    channel     VARCHAR(32) NOT NULL,
    message     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
