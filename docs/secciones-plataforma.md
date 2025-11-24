# Secciones de la Plataforma NEXOAV

Este documento describe todas las secciones disponibles en la plataforma, organizadas según la estructura del sidebar de navegación. Cada sección incluye su propósito, funcionalidad y subsecciones cuando corresponda.

---

## 1. Inicio (`/`)

**Icono:** LayoutDashboard  
**Ruta:** `/`

### Descripción
Página principal del dashboard que proporciona una visión general de la actividad de la empresa. Muestra resúmenes clave, métricas importantes y acceso rápido a las funcionalidades más utilizadas.

### Utilidad
- Vista panorámica del estado general del negocio
- Acceso rápido a tareas pendientes y notificaciones
- Métricas de rendimiento en tiempo real
- Navegación rápida a secciones principales

### Funcionalidad
- Resumen de tareas y eventos del calendario
- Indicadores de rendimiento financiero
- Accesos directos a módulos frecuentes
- Widgets personalizables según necesidades del usuario

---

## 2. Calendario (`/calendario`)

**Icono:** Calendar  
**Ruta:** `/calendario`

### Descripción
Sistema de gestión de calendario que permite visualizar y gestionar eventos, tareas, citas y actividades programadas en diferentes vistas (día, semana, mes).

### Utilidad
- Planificación y organización de actividades
- Gestión de citas con clientes
- Seguimiento de fechas importantes y vencimientos
- Coordinación de equipos y recursos

### Funcionalidad
- Visualización en múltiples formatos (día, semana, mes, agenda)
- Creación y edición de eventos y tareas
- Filtros por categorías, proyectos o clientes
- Recordatorios y notificaciones
- Sincronización con calendarios externos (opcional)

---

## 3. Mapa (`/mapa`)

**Icono:** Map  
**Ruta:** `/mapa`

### Descripción
Visualización geográfica de ubicaciones relevantes para el negocio, como clientes, proveedores, proyectos en curso o puntos de interés.

### Utilidad
- Visualización geográfica de operaciones
- Optimización de rutas y desplazamientos
- Análisis de distribución geográfica de clientes
- Planificación logística

### Funcionalidad
- Mapa interactivo con marcadores personalizables
- Filtros por tipo de ubicación
- Información detallada al hacer clic en marcadores
- Integración con servicios de mapas (Google Maps, OpenStreetMap)

---

## 4. Clientes (`/clientes`)

**Icono:** Users  
**Ruta:** `/clientes`

### Descripción
Gestión integral de la base de datos de clientes, incluyendo información de contacto, historial de transacciones, proyectos asociados y comunicación.

### Utilidad
- Centralización de información de clientes
- Seguimiento de relaciones comerciales
- Historial de interacciones y transacciones
- Gestión de contactos y comunicación

### Funcionalidad
- CRUD completo de clientes
- Búsqueda y filtrado avanzado
- Historial de facturas y proyectos
- Notas y seguimiento de comunicación
- Exportación de datos
- Segmentación y etiquetado

---

## 5. Proyectos (`/proyectos`)

**Icono:** FolderKanban  
**Ruta:** `/proyectos`

### Descripción
Sistema de gestión de proyectos que permite planificar, organizar y hacer seguimiento de todos los proyectos activos y completados de la empresa.

### Utilidad
- Organización y planificación de proyectos
- Seguimiento de progreso y estado
- Asignación de recursos y tareas
- Control de tiempos y presupuestos

### Funcionalidad
- Vista Kanban para gestión de estados
- Creación y edición de proyectos
- Asignación de tareas y responsables
- Seguimiento de tiempos y costes
- Documentación asociada
- Integración con calendario y facturación

---

## 6. Proveedores (`/proveedores`)

**Icono:** Truck  
**Ruta:** `/proveedores`

### Descripción
Gestión de proveedores y suministradores de la empresa, organizados por categorías según el tipo de servicio o producto que ofrecen.

### Subsecciones

#### 6.1. Técnicos (`/proveedores/tecnicos`)
**Descripción:** Proveedores de servicios técnicos y profesionales especializados.  
**Utilidad:** Gestión de colaboradores técnicos externos, contratistas y especialistas.  
**Funcionalidad:** Base de datos de técnicos, evaluación de servicios, historial de trabajos realizados.

#### 6.2. Materiales (`/proveedores/materiales`)
**Descripción:** Proveedores de materiales, componentes y suministros físicos.  
**Utilidad:** Control de proveedores de inventario, comparación de precios, gestión de pedidos.  
**Funcionalidad:** Catálogo de proveedores, historial de compras, evaluación de calidad y tiempos de entrega.

#### 6.3. Softwares (`/proveedores/softwares`)
**Descripción:** Proveedores de software, servicios SaaS y herramientas digitales.  
**Utilidad:** Gestión de suscripciones, licencias y servicios digitales contratados.  
**Funcionalidad:** Control de licencias, renovaciones, evaluación de servicios, costes asociados.

#### 6.4. Externos (`/proveedores/externos`)
**Descripción:** Proveedores externos diversos que no encajan en las categorías anteriores.  
**Utilidad:** Gestión de proveedores misceláneos y servicios puntuales.  
**Funcionalidad:** Base de datos flexible para cualquier tipo de proveedor externo.

---

## 7. Gastos (`/gastos`)

**Icono:** ShoppingCart  
**Ruta:** `/gastos`

### Descripción
Control y gestión de todos los gastos de la empresa, organizados mediante tickets y categorías para facilitar el análisis y la contabilización.

### Subsecciones

#### 7.1. Tickets (`/gastos/tickets`)
**Descripción:** Registro individual de cada gasto realizado, con documentación asociada (facturas, recibos, etc.).  
**Utilidad:** Trazabilidad completa de gastos, justificación fiscal, control presupuestario.  
**Funcionalidad:** Creación de tickets de gasto, adjuntar documentos, asignación de categorías, vinculación con proyectos o clientes.

#### 7.2. Categorías (`/gastos/categorias`)
**Descripción:** Sistema de categorización de gastos para organización y análisis contable.  
**Utilidad:** Clasificación contable, análisis de costes por categoría, presupuestos por tipo de gasto.  
**Funcionalidad:** Gestión de categorías personalizadas, asignación automática, informes por categoría, gráficos de distribución.

---

## 8. Facturación (`/facturacion`)

**Icono:** Receipt  
**Ruta:** `/facturacion`

### Descripción
Módulo completo de facturación que gestiona todo el ciclo de documentos comerciales, desde presupuestos hasta facturas rectificativas.

### Subsecciones

#### 8.1. Presupuestos (`/facturacion/presupuestos`)
**Descripción:** Creación y gestión de presupuestos ofrecidos a clientes.  
**Utilidad:** Propuestas comerciales, seguimiento de ofertas, conversión a facturas.  
**Funcionalidad:** Generación de presupuestos, plantillas personalizables, seguimiento de estado (pendiente, aceptado, rechazado), conversión a proforma o factura.

#### 8.2. Proformas (`/facturacion/proformas`)
**Descripción:** Gestión de facturas proforma, documentos previos a la facturación definitiva.  
**Utilidad:** Documentos comerciales previos a la facturación, especialmente útil en exportación.  
**Funcionalidad:** Creación de proformas, conversión a facturas, gestión de estados.

#### 8.3. Facturas (`/facturacion/facturas`)
**Descripción:** Gestión del ciclo completo de facturación: creación, emisión, seguimiento y cobro.  
**Utilidad:** Facturación a clientes, control de cobros, gestión fiscal.  
**Funcionalidad:** Emisión de facturas, numeración automática, plantillas personalizables, seguimiento de pagos, exportación para contabilidad, integración con Hacienda (si aplica).

#### 8.4. Rectificativas (`/facturacion/rectificativas`)
**Descripción:** Gestión de facturas rectificativas para corregir errores o modificar facturas ya emitidas.  
**Utilidad:** Corrección de facturas emitidas, cumplimiento normativo, gestión de devoluciones.  
**Funcionalidad:** Creación de facturas rectificativas vinculadas a facturas originales, gestión de estados, cumplimiento legal.

---

## 9. Inventario (`/inventario`)

**Icono:** Package  
**Ruta:** `/inventario`

### Descripción
Control de inventario de productos y servicios que la empresa ofrece o gestiona, incluyendo stock, precios y características.

### Subsecciones

#### 9.1. Productos (`/inventario/productos`)
**Descripción:** Gestión de productos físicos: stock, precios, características, proveedores.  
**Utilidad:** Control de inventario, gestión de stock, cálculo de costes, ventas.  
**Funcionalidad:** CRUD de productos, control de stock (entradas/salidas), gestión de precios, categorización, alertas de stock bajo, historial de movimientos.

#### 9.2. Servicios (`/inventario/servicios`)
**Descripción:** Catálogo de servicios ofrecidos por la empresa con sus características y precios.  
**Utilidad:** Estándarización de servicios, presupuestos rápidos, facturación automatizada.  
**Funcionalidad:** Catálogo de servicios, precios y tarifas, descripciones, vinculación con proyectos y facturación.

---

## 10. Tesorería (`/tesoreria`)

**Icono:** Wallet  
**Ruta:** `/tesoreria`

### Descripción
Gestión financiera de la tesorería de la empresa: cuentas bancarias, flujo de caja, pagos y cobros.

### Subsecciones

#### 10.1. Cuentas Bancarias (`/tesoreria/cuentas-bancarias`)
**Descripción:** Gestión de todas las cuentas bancarias de la empresa y sus movimientos.  
**Utilidad:** Control centralizado de cuentas, conciliación bancaria, seguimiento de saldos.  
**Funcionalidad:** Registro de cuentas bancarias, importación de movimientos, conciliación, saldos en tiempo real, múltiples cuentas.

#### 10.2. Cashflow (`/tesoreria/cashflow`)
**Descripción:** Análisis y proyección del flujo de caja de la empresa.  
**Utilidad:** Planificación financiera, previsión de tesorería, detección de problemas de liquidez.  
**Funcionalidad:** Visualización de flujo de caja (entradas/salidas), proyecciones futuras, gráficos temporales, alertas de liquidez.

#### 10.3. Pagos y Cobros (`/tesoreria/pagos-cobros`)
**Descripción:** Registro y seguimiento de todos los pagos realizados y cobros recibidos.  
**Utilidad:** Control de pagos pendientes, seguimiento de cobros, gestión de vencimientos.  
**Funcionalidad:** Registro de pagos y cobros, vinculación con facturas y gastos, seguimiento de vencimientos, alertas de pagos pendientes, estados de pago.

---

## 11. Contabilidad (`/contabilidad`)

**Icono:** FileText  
**Ruta:** `/contabilidad`

### Descripción
Módulo contable completo que gestiona el plan de cuentas, balances y activos de la empresa.

### Subsecciones

#### 11.1. Cuadro de Cuentas (`/contabilidad/cuadro-cuentas`)
**Descripción:** Plan contable de la empresa con todas las cuentas organizadas jerárquicamente.  
**Utilidad:** Estructura contable, clasificación de operaciones, base para balances y estados financieros.  
**Funcionalidad:** Gestión del plan de cuentas, jerarquía de cuentas, códigos contables, vinculación con operaciones, importación/exportación.

#### 11.2. Balance de Situación (`/contabilidad/balance-situacion`)
**Descripción:** Generación y visualización del balance de situación (balance general) de la empresa.  
**Utilidad:** Análisis de la situación patrimonial, cumplimiento legal, toma de decisiones financieras.  
**Funcionalidad:** Generación automática del balance, filtros por fecha, exportación, comparativas temporales, estructura de activos y pasivos.

#### 11.3. Activos (`/contabilidad/activos`)
**Descripción:** Gestión y amortización de activos fijos de la empresa.  
**Utilidad:** Control de activos, cálculo de amortizaciones, valoración patrimonial.  
**Funcionalidad:** Registro de activos, cálculo de amortizaciones, seguimiento de valor, categorización, historial de activos.

---

## 12. Impuestos (`/impuestos`)

**Icono:** Calculator  
**Ruta:** `/impuestos`

### Descripción
Gestión y cálculo de impuestos aplicables a la empresa, incluyendo IVA, IRPF, y otros impuestos según la legislación aplicable.

### Utilidad
- Cálculo automático de impuestos
- Declaraciones trimestrales y anuales
- Cumplimiento fiscal
- Análisis de carga fiscal

### Funcionalidad
- Cálculo de IVA (soportado y repercutido)
- Gestión de retenciones (IRPF, etc.)
- Declaraciones periódicas
- Informes fiscales
- Integración con módulos de facturación y contabilidad
- Alertas de vencimientos fiscales

---

## 13. Analítica (`/analitica`)

**Icono:** BarChart  
**Ruta:** `/analitica`

### Descripción
Módulo de análisis y reporting que proporciona informes, métricas y visualizaciones para la toma de decisiones empresariales.

### Subsecciones

#### 13.1. Informes (`/analitica/informes`)
**Descripción:** Generación de informes personalizados sobre diferentes aspectos del negocio.  
**Utilidad:** Análisis de rendimiento, toma de decisiones basada en datos, presentaciones a stakeholders.  
**Funcionalidad:** Informes predefinidos y personalizables, exportación (PDF, Excel), filtros avanzados, gráficos y visualizaciones, programación de informes.

#### 13.2. Objetivos (`/analitica/objetivos`)
**Descripción:** Definición y seguimiento de objetivos empresariales y KPIs.  
**Utilidad:** Planificación estratégica, seguimiento de metas, evaluación de rendimiento.  
**Funcionalidad:** Definición de objetivos, KPIs personalizables, seguimiento de progreso, alertas, dashboards de objetivos.

---

## 14. RRHH (`/rrhh`)

**Icono:** Briefcase  
**Ruta:** `/rrhh`

### Descripción
Módulo de Recursos Humanos que gestiona empleados, nóminas y trabajadores externos de la empresa.

### Subsecciones

#### 14.1. Nóminas (`/rrhh/nominas`)
**Descripción:** Gestión completa del proceso de nóminas: cálculo, emisión y registro.  
**Utilidad:** Automatización de nóminas, cumplimiento laboral, control de costes de personal.  
**Funcionalidad:** Cálculo automático de nóminas, gestión de conceptos salariales, generación de recibos, exportación para contabilidad, historial de nóminas.

#### 14.2. Empleados (`/rrhh/empleados`)
**Descripción:** Base de datos de empleados con información laboral, contratos y documentación.  
**Utilidad:** Gestión de personal, control de contratos, documentación laboral.  
**Funcionalidad:** Fichas de empleados, gestión de contratos, documentación asociada, historial laboral, permisos y ausencias.

#### 14.3. Externos (`/rrhh/externos`)
**Descripción:** Gestión de trabajadores externos, colaboradores y freelancers.  
**Utilidad:** Control de colaboradores externos, gestión de honorarios, documentación.  
**Funcionalidad:** Registro de externos, gestión de honorarios, facturas de autónomos, seguimiento de colaboraciones.

---

## 15. Empresa (`/empresa`)

**Icono:** Building2  
**Ruta:** `/empresa`

### Descripción
Configuración y gestión de datos de la empresa, preferencias del sistema, plantillas y conectividad con servicios externos. Esta sección se muestra separada en la parte inferior del sidebar.

### Subsecciones

#### 15.1. Datos Fiscales (`/empresa/datos-fiscales`)
**Descripción:** Información fiscal y legal de la empresa necesaria para facturación y cumplimiento normativo.  
**Utilidad:** Configuración de datos para documentos legales, cumplimiento fiscal.  
**Funcionalidad:** Gestión de datos fiscales (CIF, dirección, datos de registro), configuración de impuestos, datos bancarios para facturación.

#### 15.2. Preferencias (`/empresa/preferencias`)
**Descripción:** Configuración general de la plataforma y preferencias de usuario y empresa.  
**Utilidad:** Personalización del sistema según necesidades de la empresa.  
**Funcionalidad:** Configuración de temas, idioma, formato de fechas, moneda, notificaciones, permisos de usuario.

#### 15.3. Plantillas (`/empresa/plantillas`)
**Descripción:** Gestión de plantillas personalizadas para documentos (facturas, presupuestos, emails, etc.).  
**Utilidad:** Personalización de documentos, branding empresarial, estandarización.  
**Funcionalidad:** Creación y edición de plantillas, preview, aplicación a documentos, gestión de múltiples plantillas.

#### 15.4. Conectividad (`/empresa/conectividad`)
**Descripción:** Configuración de integraciones con servicios externos y APIs.  
**Utilidad:** Integración con herramientas externas, automatización, sincronización de datos.  
**Funcionalidad:** Configuración de APIs, integraciones con servicios de terceros, sincronización, webhooks, autenticación.

#### 15.5. Documentación (`/empresa/documentacion`)
**Descripción:** Almacenamiento y gestión de documentación empresarial importante.  
**Utilidad:** Centralización de documentos legales, contratos, certificados.  
**Funcionalidad:** Almacenamiento de documentos, categorización, búsqueda, versionado, acceso controlado.

---

## Resumen de Estructura

### Secciones Principales (sin subsecciones)
1. Inicio
2. Calendario
3. Mapa
4. Clientes
5. Proyectos
6. Impuestos

### Secciones con Subsecciones
1. **Proveedores** (4 subsecciones)
2. **Gastos** (2 subsecciones)
3. **Facturación** (4 subsecciones)
4. **Inventario** (2 subsecciones)
5. **Tesorería** (3 subsecciones)
6. **Contabilidad** (3 subsecciones)
7. **Analítica** (2 subsecciones)
8. **RRHH** (3 subsecciones)
9. **Empresa** (5 subsecciones)

### Total de Rutas
- **Secciones principales:** 6
- **Subsecciones:** 26
- **Total de rutas únicas:** 32

---

## Notas para el Desarrollo de la Base de Datos

Este documento sirve como referencia para el diseño del esquema de base de datos. Cada sección y subsección representa una entidad o módulo que requerirá:

- **Tablas principales** para cada sección
- **Relaciones** entre entidades (clientes-proyectos-facturas, etc.)
- **Campos específicos** según la funcionalidad descrita
- **Índices** para búsquedas y filtros
- **Validaciones** según las reglas de negocio

Se recomienda comenzar con un modelo de datos mock que cubra las entidades principales antes de implementar la base de datos definitiva.

