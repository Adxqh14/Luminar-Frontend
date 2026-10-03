type Stat = {
  title: string;
  value: string;
  trend: string;
  up: boolean;
  caption: string;
  sub: string;
};

const stats: Stat[] = [
  { title: "Tareas completadas", value: "128", trend: "+18%", up: true, caption: "Buena racha esta semana", sub: "Comparado con la semana pasada" },
  { title: "Eventos esta semana", value: "7", trend: "-10%", up: false, caption: "Semana más ligera", sub: "Menos reuniones que la anterior" },
  { title: "Racha de productividad", value: "12 días", trend: "+12.5%", up: true, caption: "Constancia en aumento", sub: "Tareas completadas a tiempo" },
  { title: "Tiempo en foco", value: "4.2h", trend: "+4.5%", up: true, caption: "Mejora sostenida", sub: "Promedio diario esta semana" },
];

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">{stat.title}</span>
        <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
          {stat.up ? "↗" : "↘"} {stat.trend}
        </span>
      </div>
      <div className="mb-3 text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
      <div className="text-sm font-medium text-neutral-900 dark:text-white">
        {stat.caption} {stat.up ? "↗" : "↘"}
      </div>
      <div className="text-xs text-neutral-400 dark:text-neutral-500">{stat.sub}</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-lg font-medium text-neutral-900 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {stats.map((s) => (
          <StatCard key={s.title} stat={s} />
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Actividad de tareas</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Tareas completadas en los últimos 3 meses
            </p>
          </div>
        </div>
        <div className="flex h-44 items-center justify-center rounded-lg bg-neutral-50 text-sm text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500">
          Gráfico de actividad (por conectar)
        </div>
      </div>
    </div>
  );
}