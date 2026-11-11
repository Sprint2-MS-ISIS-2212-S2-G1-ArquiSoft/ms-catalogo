--
-- BD Catalogo · esquema y datos semilla del microservicio catalogo.
-- Extraido de database/solventa.sql del monolito modular.
-- Solo las tablas que pertenecen a Catalogo: no se replica la llave foranea
-- cotizaciones."productoId" -> productos_seguro(id), porque Cotizacion vive
-- en otro microservicio.
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

--
-- Name: productos_seguro_ramo_enum; Type: TYPE
--
DO $$
BEGIN
    CREATE TYPE public.productos_seguro_ramo_enum AS ENUM (
        'VIDA',
        'SALUD',
        'AUTOS',
        'HOGAR',
        'DESEMPLEO'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

--
-- Name: productos_seguro; Type: TABLE
--
CREATE TABLE IF NOT EXISTS public.productos_seguro (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    ramo public.productos_seguro_ramo_enum NOT NULL,
    "sumaAseguradaMaxima" numeric(14,2) NOT NULL,
    CONSTRAINT "PK_cc30922adee5a40a26efb95af8e" PRIMARY KEY (id)
);

--
-- Datos semilla
--
INSERT INTO public.productos_seguro (id, nombre, ramo, "sumaAseguradaMaxima")
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Seguro de Vida Base', 'VIDA', 5000000.00)
ON CONFLICT DO NOTHING;
