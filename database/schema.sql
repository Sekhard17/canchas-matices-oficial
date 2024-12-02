/*
Base de datos para el sistema de reserva de canchas de empresa: Matices.
Autor: Joaquín Ignacio Andrade Muñoz
Fecha: 23-09-2024
Descripción: Este script contiene la definición de la base de datos para el sistema de reserva de canchas de la empresa Matices.
*/

-- La tabla usuarios contiene su información de usuarios
CREATE TABLE usuarios (
    rut text PRIMARY KEY,
    nombre text NOT NULL,
    apellido text NOT NULL,
    correo text NOT NULL,
    teléfono text,
    contraseña text NOT NULL,
    fecha_registro date NOT NULL,
    estado text NOT NULL CHECK (estado IN ('activo', 'inactivo')),
    rol text NOT NULL
);

-- La tabla canchas contiene información sobre las canchas
CREATE TABLE canchas (
    id_cancha bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre text NOT NULL,
    ubicación text NOT NULL,
    tipo text NOT NULL
);

-- La tabla reservas contiene información sobre las reservas
CREATE TABLE reservas (
    id_reserva bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fecha date NOT NULL,
    hora_inicio time NOT NULL,
    hora_fin time NOT NULL,
    estado text NOT NULL CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
    id_cancha bigint NOT NULL REFERENCES canchas(id_cancha),
    rut_usuario text NOT NULL REFERENCES usuarios(rut),
    codigo_reserva text UNIQUE NOT NULL, -- Código único para la reserva
    codigo_qr text -- URL o datos del código QR
);

-- La tabla solicitudes contiene información sobre las solicitudes
CREATE TABLE solicitudes (
    id_solicitud bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fecha_solicitud date NOT NULL,
    motivo text NOT NULL,
    nueva_hora_inicio time,
    nueva_hora_fin time,
    tipo_solicitud text NOT NULL,
    estado_solicitud text NOT NULL CHECK (estado_solicitud IN ('pendiente', 'aprobada', 'rechazada')),
    rut_usuario text NOT NULL REFERENCES usuarios(rut)
);

-- La tabla respuesta_solicitud contiene información sobre las respuestas a las solicitudes
CREATE TABLE respuesta_solicitud (
    id_respuesta bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fecha_respuesta date NOT NULL,
    respuesta text NOT NULL,
    estado text NOT NULL CHECK (estado IN ('pendiente', 'respondida')),
    id_solicitud bigint NOT NULL UNIQUE REFERENCES solicitudes(id_solicitud)
);

-- La tabla ganancias contiene información sobre las ganancias
CREATE TABLE ganancias (
    id_ganancia bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    numero_reservas int NOT NULL,
    periodo text NOT NULL,
    monto_total decimal(10, 2) NOT NULL,
    fecha date NOT NULL
);

-- La tabla pagos contiene información sobre los pagos
CREATE TABLE pagos (
    id_pago bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    monto decimal(10, 2) NOT NULL,
    fecha_pago timestamp NOT NULL,
    metodo_pago text NOT NULL,
    estado text NOT NULL CHECK (estado IN ('procesado', 'fallido', 'pendiente')),
    id_reserva bigint NOT NULL REFERENCES reservas(id_reserva),
    id_ganancia bigint NOT NULL REFERENCES ganancias(id_ganancia),
    rut_usuario text NOT NULL REFERENCES usuarios(rut),
    -- Campos específicos para Mercado Pago
    mp_payment_id text UNIQUE,
    mp_payment_status text,
    mp_status_detail text,
    mp_payment_method_id text,
    mp_payment_type_id text,
    mp_merchant_order_id text,
    mp_external_reference text,
    mp_transaction_amount decimal(10, 2),
    mp_installments int,
    mp_card_last_four_digits text,
    mp_card_holder_name text,
    mp_authorization_code text,
    metadata jsonb -- Para almacenar datos adicionales del pago
);

-- La tabla auditoria contiene información sobre las acciones realizadas
CREATE TABLE auditoria (
    id_auditoria bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fecha timestamp NOT NULL,
    acción text NOT NULL,
    detalles text NOT NULL,
    entidad_afectada text NOT NULL,
    id_entidad bigint NOT NULL,
    rut_usuario text NOT NULL REFERENCES usuarios(rut)
);

-- La tabla reportes contiene información sobre los reportes generados
CREATE TABLE reportes (
    id_reporte bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fecha_reporte date NOT NULL,
    tipo_reporte text NOT NULL,
    descripción text NOT NULL,
    rut_usuario text NOT NULL REFERENCES usuarios(rut)
);

-- La tabla notificaciones contiene información sobre las notificaciones
CREATE TABLE notificaciones (
    id_notificacion bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    título text NOT NULL,
    mensaje text NOT NULL,
    estado text NOT NULL CHECK (estado IN ('leído', 'no leído')),
    rut_usuario text NOT NULL REFERENCES usuarios(rut)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_reservas_fecha ON reservas(fecha);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_mp_payment_id ON pagos(mp_payment_id);
CREATE INDEX idx_reservas_codigo ON reservas(codigo_reserva);

-- Comentarios en las tablas
COMMENT ON TABLE reservas IS 'Almacena las reservas de canchas incluyendo códigos únicos y QR';
COMMENT ON TABLE pagos IS 'Almacena información detallada de pagos, incluyendo datos específicos de Mercado Pago';
COMMENT ON COLUMN reservas.codigo_reserva IS 'Código único alfanumérico para identificar la reserva';
COMMENT ON COLUMN reservas.codigo_qr IS 'Datos o URL del código QR generado para la reserva';
COMMENT ON COLUMN pagos.mp_payment_id IS 'ID de pago generado por Mercado Pago';
COMMENT ON COLUMN pagos.metadata IS 'Datos adicionales del pago en formato JSON';