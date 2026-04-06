# Resumen de Estructura y Componentes - Dash Certification

## 📋 Estructura General del Proyecto

```
dash-certification/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/          # Página de autenticación
│   │   └── (dashboard)/        # Rutas protegidas
│   │       ├── dashboard/      # Panel de control (KPIs, gráficos)
│   │       ├── certificados/   # Gestión de certificados (upload Excel)
│   │       ├── catálogos/      # Catálogos
│   │       ├── plantillas/     # Gestión de plantillas Word (.docx)
│   │       ├── empresas/       # CRUD de empresas (grid de tarjetas)
│   │       └── settings/       # Configuración
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Navbar.tsx      # Barra superior con búsqueda, tema, perfil
│   │   │   ├── Sidebar.tsx     # Navegación lateral colapsable
│   │   │   └── Card.tsx        # Componente genérico de tarjeta
│   │   │
│   │   └── features/           # Componentes por dominio
│   │       ├── dashboard/      # StatCard, StorageDonut, BucketBars, etc.
│   │       ├── certificates/   # DocxPreview, ExcelDropzone
│   │       ├── companies/      # CompanyCard, CompanyModal, CompanyCardSkeleton
│   │       └── templates/      # TemplateRow, TemplateUploadModal
│   │
│   ├── hooks/
│   │   ├── useDashboardData.ts
│   │   ├── useCompanies.ts
│   │   └── useTemplates.ts
│   │
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   ├── companies/
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── dashboard/
│   │   │   └── utils.ts
│   │   └── templates/
│   │       ├── types.ts
│   │       └── utils.ts
│   │
│   ├── globals.css            # Tema, variables CSS, utilidades
│   └── middleware.ts          # Protección de rutas
│
├── package.json
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## 🎨 Configuración de Tailwind y Variables CSS

### PostCSS Configuration
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Variables CSS Personalizadas (globals.css)

**Modo Claro (`:root`):**
```css
--background: #ffffff;
--foreground: #1b2559;
--card: #ffffff;
--border: #e2e8f0;
--navbar-glass: color-mix(in srgb, #ffffff 82%, transparent);
--input-bg: #f1f5f9;
--input-bg-focus: #ffffff;

/* Accent */
--accent: #0ea5e9;              /* Azul claro */
--accent-dark: #0284c7;         /* Azul oscuro */
--accent-hover: #0369a1;
--accent-soft: rgb(14 165 233 / 0.1);
--accent-ring: rgb(14 165 233 / 0.3);

/* Sidebar */
--sidebar-bg: #f8fafc;
--sidebar-border: #e2e8f0;
--sidebar-fg: #475569;
--sidebar-active-bg: color-mix(in srgb, #0ea5e9 10%, #f8fafc);
--sidebar-active-icon: #0284c7;
```

**Modo Oscuro (`.dark`):**
```css
--background: #12141f;
--foreground: #f4f7fe;
--card: #1a1d2e;
--border: rgba(255, 255, 255, 0.08);

/* Accent dark */
--accent: #38bdf8;              /* Azul más brillante */
--accent-dark: #7dd3fc;
--sidebar-bg: #12141f;
```

### Utilidades Personalizadas
```css
/* Accent utilities */
.bg-accent-soft      /* Fondo suave de acento */
.bg-accent-gradient  /* Gradiente accent-dark a accent */
.text-accent         /* Texto con color acento */
.hover:bg-accent     /* Hover interactivos */
.focus:ring-accent   /* Rings de foco */
```

---

## 🔧 Componentes Principales

### 1. DashboardLayout.tsx
**Ubicación:** `src/app/(dashboard)/layout.tsx`

```typescript
"use client";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-500 
        ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <Navbar />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Características:**
- Layout _"use client"_ responsivo con estado local
- Sidebar colapsable (220px → 52px)
- Transiciones suaves (400-500ms cubic-bezier)
- Margen dinámico en main basado en collapse
- Navbar pegado (sticky) bajo el sidebar

---

### 2. Sidebar.tsx
**Ubicación:** `src/components/ui/Sidebar.tsx`

```typescript
"use client";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Certificados", href: "/certificados", icon: FileStack },
    { name: "Catálogos", href: "/catalogos", icon: Book },
    { name: "Plantillas", href: "/plantillas", icon: FileText },
    { name: "Empresas", href: "/empresas", icon: Users },
    { name: "Configuración", href: "/settings", icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 z-50 h-screen
      transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
      ${isCollapsed ? "w-[52px]" : "w-[220px]"}`}>
      
      {/* Header con logo */}
      <div className="relative flex items-center h-16 px-3">
        {isCollapsed ? (
          <button onClick={() => setIsCollapsed(false)}>
            <PanelLeftOpen size={15} />
          </button>
        ) : (
          <>
            <div className="rounded-[7px] bg-gradient-to-r 
              from-[var(--accent-dark)] to-[var(--accent)]">
              {/* SVG logo 2x2 grid */}
            </div>
            <span className="flex-1 ml-2.5">AutoCert</span>
            <button onClick={() => setIsCollapsed(true)}>
              <PanelLeftClose size={15} />
            </button>
          </>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href}>
              {isActive && <span className="indicator" />}
              <item.icon size={16} />
              <span className={`whitespace-nowrap 
                ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

**Características Responsive:**
- **Ancho**: 220px (expandido) ↔ 52px (colapsado)
- **Comportamiento**: Click en área colapsada expande automáticamente
- **Tooltip**: Aparece texto de ítems cuando está colapsado
- **Iconos**: Desde `lucide-react` con tamaño 16px
- **Estados**: Active link con indicador y color `var(--sidebar-active-icon)`
- **Transición**: cubic-bezier personalizado para animación suave

---

### 3. Navbar.tsx
**Ubicación:** `src/components/ui/Navbar.tsx`

```typescript
"use client";
export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  // Header sticky
  return (
    <header className="h-20 bg-[var(--navbar-glass)] backdrop-blur-md 
      border-b border-[var(--border)] sticky top-0 z-40 
      px-8 flex items-center justify-between">
      
      {/* Buscador */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 
          text-slate-400 group-focus-within:text-[var(--accent)]" />
        <input
          type="text"
          placeholder="Buscar certificados..."
          className="w-full bg-[var(--input-bg)] rounded-2xl py-2.5 pl-11 pr-4
            focus:ring-2 focus:ring-[var(--accent-ring)]"
        />
      </div>

      {/* Acciones derechas */}
      <div className="flex items-center gap-4">
        {/* Toggle Tema */}
        <button onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          className={`p-2.5 rounded-xl transition-all
            ${isDarkMode ? 'bg-[var(--accent-soft)] text-[var(--accent)]' 
              : 'text-slate-400 hover:bg-[var(--accent-soft)]'}`}>
          <Moon size={20} />
        </button>

        {/* Notificaciones */}
        <button className="relative p-2.5 text-slate-400 hover:text-[var(--accent)]">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 
            bg-red-500 rounded-full" />
        </button>

        {/* Perfil + Dropdown */}
        <div className="relative pl-4 border-l border-slate-100 dark:border-slate-700">
          <button onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{displayName}</p>
            </div>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center 
              text-white font-bold bg-gradient-to-r 
              from-[var(--accent-dark)] to-[var(--accent)]">
              {initials}
            </div>
            <ChevronDown size={16} 
              className={`${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#1a1d2e]
              rounded-2xl shadow-xl border border-[var(--border)]">
              <button onClick={handleLogout} 
                className="w-full px-4 py-2.5 text-left text-red-500">
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

**Características Responsive:**
- **Alto fijo**: 44px (h-20)
- **Buscador**: 384px ancho (w-96) con glassmorphism backdrop
- **Display Name**: Oculto en móvil (`hidden sm:block`)
- **Avatar**: Gradiente dinámico desde Supabase
- **Tema**: Toggle light/dark con `next-themes`
- **Dropdown**: Overlay para cerrar haciendo clic fuera

---

### 4. Card.tsx
**Ubicación:** `src/components/ui/Card.tsx`

```typescript
export const Card = ({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-[var(--card)] p-6 rounded-[24px] 
    shadow-sm border border-[var(--border)] 
    transition-colors ${className}`}>
    {title && (
      <h3 className="text-slate-500 dark:text-slate-400 
        font-semibold text-sm mb-4 uppercase tracking-wider">
        {title}
      </h3>
    )}
    {children}
  </div>
);
```

**Características:**
- Contenedor genérico reutilizable
- Bordes: 24px rounded
- Sombra suave (shadow-sm)
- Borde con variable de tema
- Título optional en mayúsculas

---

## 📄 Estructura de Vistas Principales

### Vista: Dashboard (`/dashboard`)

```typescript
// Estructura: Layout con grid responsive de secciones
<div className="p-6 lg:p-8 space-y-6">
  {/* Header animado */}
  <motion.header>
    <h1>Panel de Control</h1>
  </motion.header>

  {/* Stats animadas con delay */}
  <Section title="KPIs" delay={0.1}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard />
    </div>
  </Section>

  {/* Gráficos */}
  <Section title="Storage" delay={0.2}>
    <StorageDonut /> {/* Gráfico circular */}
  </Section>

  <Section title="Uso por Bucket">
    <BucketBars /> {/* Gráfico de barras */}
  </Section>
</div>
```

**Características:**
- Animaciones con Framer Motion
- Grid responsive: 1 col (móvil) → 4 cols (desktop)
- Delays escalonados para stagger effect
- Uso de hooks personalizados (`useDashboardData`)

---

### Vista: Empresas (`/empresas`)

```typescript
// Estructura: Grid de tarjetas con CRUD modal
<div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8">
  {/* Header con botón */}
  <div className="flex flex-col md:flex-row md:items-center justify-between">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">Empresas</h1>
      <p>Administra las entidades...</p>
    </div>
    <button className="px-6 py-3 bg-accent text-white rounded-xl">
      <Plus size={20} /> Nueva Empresa
    </button>
  </div>

  {/* Grid de tarjetas */}
  {loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <CompanyCardSkeleton /> {/* x6 */}
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {companies.map(c => <CompanyCard company={c} />)}
    </div>
  )}

  {/* Modal de crear/editar */}
  {showModal && <CompanyModal />}
</div>
```

**Características Responsive:**
- **Breakpoints**:
  - Móvil: 1 columna, padding 16px
  - Tablet: 2 columnas, padding 32px
  - Desktop XL: 3 columnas
- **Gap**: 24px entre items
- **Card Width**: Flexible, respeta grid
- **Modal**: Full-screen overlay

---

### Vista: Plantillas (`/plantillas`)

```typescript
// Estructura: Tabla responsive con búsqueda
<div className="p-4 md:p-8 space-y-8">
  {/* Header con botón de upload */}
  <div className="flex...">
    <h1>Plantillas Word</h1>
    <button className="px-6 py-3 bg-accent">
      <Plus /> Subir Plantilla
    </button>
  </div>

  {/* Buscador */}
  <div className="relative max-w-md">
    <Search className="absolute left-4" />
    <input placeholder="Buscar por nombre o empresa..." />
  </div>

  {/* Tabla responsiva */}
  <div className="bg-[var(--card)] rounded-[24px] border overflow-hidden">
    <div className="overflow-x-auto"> {/* Scroll horizontal en móvil */}
      <table className="w-full">
        <thead>
          <tr>
            <th>Nombre del Archivo</th>
            <th>Empresa Asignada</th>
            <th>Última Modificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => <TemplateRow template={t} />)}
        </tbody>
      </table>
    </div>
  </div>

  {/* Modal upload */}
  {showModal && <TemplateUploadModal />}
</div>
```

**Características:**
- **Búsqueda**: Filter en tiempo real con `useMemo`
- **Tabla**: Scroll horizontal en móvil (`overflow-x-auto`)
- **Upload**: Modal separado con zona de drag-drop
- **Preview**: Componente `DocxPreview` para archivos

---

### Vista: Certificados (`/certificados`)

```typescript
// Estructura: Excel dropzone + vista previa
<div className="p-4 md:p-8 space-y-8">
  <h1>Certificados</h1>

  {/* Zona de upload dragable */}
  <ExcelDropzone 
    onFileSelect={setFile}
    currentFile={currentFile}
  />

  {/* Preview del archivo subido */}
  {currentFile && (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <h3>Vista Previa</h3>
        <DocxPreview file={currentFile} />
      </div>
      <div>
        <h3>Mapeo de Campos</h3>
        {/* Formulario de mapeo dinámico */}
      </div>
    </div>
  )}
</div>
```

**Características:**
- **ExcelDropzone**: Componente custom con drag-drop
- **Estados visuales**: Color cambia según si hay archivo
- **DocxPreview**: Preview inline de documentos
- **Grid responsivo**: 1 col (móvil) → 2 cols (desktop)

---

## 🎯 Patrones Responsive Detectados

### Breakpoints Principales
```css
/* Tailwind v4 defaults + custom usage */
sm: 640px   /* Hidden en móvil: sm:hidden, sm:block */
md: 768px   /* Layout changes: md:flex-row, md:p-8 */
lg: 1024px  /* Font size: lg:text-3xl */
xl: 1280px  /* Grid cols: xl:grid-cols-3 */
```

### Estrategias de Responsive

1. **Padding Dinámico**
   ```jsx
   p-4 md:p-8           // 16px → 32px
   px-8 py-2.5          // Diferentes ejes
   ```

2. **Grid Responsive**
   ```jsx
   grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3
   // 1 col (móvil) → 2 (tablet) → 3 (desktop)
   ```

3. **Flexbox Responsive**
   ```jsx
   flex-col md:flex-row  // Stack vertical → horizontal
   justify-between gap-4 // Espaciado adaptativo
   ```

4. **Sidebar Adaptatif**
   ```jsx
   fixed left-0 w-[220px] /* no se oculta en versión actual */
   /* Pero tiene collapse internal para móviles efectivo */
   ```

5. **Tabla Scrolleable**
   ```jsx
   <div className="overflow-x-auto">
     <table className="w-full">
       {/* Scroll horizontal en pantallas pequeñas */}
     </table>
   </div>
   ```

6. **Ocultar/Mostrar elementos**
   ```jsx
   hidden sm:block   // Nombre de usuario: oculto en móvil
   sm:hidden         // Elementos alternativos en móvil
   ```

---

## 📦 Dependencias Clave

```json
{
  "dependencies": {
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "lucide-react": "^1.7.0",      // Iconos
    "framer-motion": "^12.38.0",   // Animaciones
    "next-themes": "^0.4.6",       // Dark mode
    "@supabase/ssr": "^0.10.0",    // BD
    "clsx": "^2.1.1"               // Class merging
  },
  "devDependencies": {
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4"
  }
}
```

---

## 🚀 Recomendaciones para Diseño Fully Responsive

1. **Sidebar en Móvil**: Considerar drawer/offcanvas en lugar de fixed en pantallas < 768px
2. **Navbar**: Habilitar menú hamburguesa en móvil
3. **Tablas**: Aplicar diseño card en móvil o usar scroll horizontal
4. **Formularios Modales**: Fullscreen en móvil, centered en desktop
5. **Font Sizes**: Escalable desde 12px (móvil) → 18px (desktop)
6. **Espaciado**: Aumentar gaps en desktop para "breathing room"
7. **Max-width**: Limitar ancho máximo en desktop (2xl/7xl)

---

**Generado**: Resumen completo para optimización responsive  
**Fecha**: Abril 2026
