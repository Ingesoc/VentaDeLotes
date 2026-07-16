-- ============================================================
-- Seed real data for La Holanda project (with price schedules)
-- ============================================================

-- 1. Register the admin user (run AFTER creating user in Auth)
INSERT INTO admins (email, role_name)
VALUES ('ingesoctic@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Update lots with real areas, prices (launch price 2026-09-15), and status
INSERT INTO lots (id, area_m2, price, status, aerial_image, perspective_image, shared_aerial_with, topography, view_text, access)
VALUES
  ('01', 8910.37, 189242850, 'disponible', '/lots/masterplan-render.jpg', '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('02', 2008,    189242850, 'disponible', '/lots/lote-02-03-aerial.jpg', '/lots/perspectiva-general.jpg', '03', NULL, NULL, NULL),
  ('03', 2013,    185619550, 'disponible', '/lots/lote-02-03-aerial.jpg', '/lots/perspectiva-general.jpg', '02', NULL, NULL, NULL),
  ('04', 2004,    165570750, 'disponible', '/lots/lote-04-05-aerial.jpg', '/lots/perspectiva-general.jpg', '05', NULL, NULL, NULL),
  ('05', 2005,    169412550, 'disponible', '/lots/lote-04-05-aerial.jpg', '/lots/perspectiva-general.jpg', '04', NULL, NULL, NULL),
  ('06', 2005,    158822900, 'disponible', '/lots/lote-06-aerial.jpg',     '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('07', 2010,    159082250, 'disponible', '/lots/lote-07-08-aerial.jpg', '/lots/perspectiva-general.jpg', '08', NULL, NULL, NULL),
  ('08', 2005,    184469100, 'disponible', '/lots/lote-07-08-aerial.jpg', '/lots/perspectiva-general.jpg', '07', 'Ondulada suave', 'Panorámica al valle', 'Directo principal'),
  ('09', 2011,    189883150, 'disponible', '/lots/lote-09-aerial.jpg',     '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('10', 2966,    NULL,      'disponible', '/lots/masterplan-render.jpg', '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('11', 2502,    237690000, 'disponible', '/lots/masterplan-render.jpg', '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('12', 2456,    233320000, 'disponible', '/lots/masterplan-render.jpg', '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('13', 3216,    305520000, 'disponible', '/lots/masterplan-render.jpg', '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('14', 2518,    239210000, 'disponible', '/lots/masterplan-render.jpg', '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('15', 2908,    NULL,      'disponible', '/lots/masterplan-render.jpg', '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL),
  ('16', 6689,    NULL,      'disponible', '/lots/masterplan-render.jpg', '/lots/perspectiva-general.jpg', NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  area_m2            = EXCLUDED.area_m2,
  price              = EXCLUDED.price,
  status             = EXCLUDED.status,
  aerial_image       = EXCLUDED.aerial_image,
  perspective_image  = EXCLUDED.perspective_image,
  shared_aerial_with = EXCLUDED.shared_aerial_with,
  topography         = EXCLUDED.topography,
  view_text          = EXCLUDED.view_text,
  access             = EXCLUDED.access;
