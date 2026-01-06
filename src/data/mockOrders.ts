import { Order } from "@/src/models/Order";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    category: "Сантехника",
    description:
      "СРОЧНО! Течет кран на кухне. Район Центральный, ул. Ленина 45. Нужно сегодня!",
    city: "Москва",
    contact: "@ivan_petrov",
    createdAt: minutesAgo(8),
    expiresInMinutes: 60,
    status: "active",
    takenBy: [{ executorId: "exec_1", takenAt: minutesAgo(7) }],
    cityLocked: true,
  },
  {
    id: "2",
    category: "Электрика",
    description:
      "Не работает розетка в спальне. Ленинский район, возле метро Парк культуры.",
    city: "Москва",
    contact: "@ivan_petrov",
    createdAt: minutesAgo(15),
    expiresInMinutes: 60,
    status: "active",
    takenBy: [
      { executorId: "exec_1", takenAt: minutesAgo(12) },
      { executorId: "exec_2", takenAt: minutesAgo(11) },
    ],
    cityLocked: true,
  },
  {
    id: "3",
    category: "Клининг",
    description: "Уборка 2-комнатной квартиры после ремонта. Можайский район.",
    city: "Москва",
    contact: "@ivan_petrov",
    createdAt: minutesAgo(22),
    expiresInMinutes: 60,
    status: "active",
    takenBy: [],
    cityLocked: true,
  },
  {
    id: "4",
    category: "Бытовая техника",
    description:
      "Стиральная машина не включается. Южный округ, микрорайон Зеленый.",
    city: "Санкт-Петербург",
    contact: "@ivan_petrov",
    createdAt: minutesAgo(31),
    expiresInMinutes: 60,
    status: "active",
    takenBy: [
      { executorId: "exec_1", takenAt: minutesAgo(30) },
      { executorId: "exec_2", takenAt: minutesAgo(29) },
      { executorId: "exec_3", takenAt: minutesAgo(28) },
    ],
    cityLocked: true,
  },
  {
    id: "5",
    category: "Сборка/установка",
    description: "Собрать шкаф ИКЕА. Есть все инструменты. Центр, ул. Пушкина.",
    city: "Москва",
    contact: "@ivan_petrov",
    createdAt: minutesAgo(42),
    expiresInMinutes: 60,
    status: "active",
    takenBy: [],
    cityLocked: true,
  },
];
