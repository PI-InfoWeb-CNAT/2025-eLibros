export interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  image: string;
}

export const mockBooks: Book[] = [
  {
    id: 1,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    price: "45,90",
    image: "/placeholder.png"
  },
  {
    id: 2,
    title: "O Cortiço",
    author: "Aluísio Azevedo", 
    price: "39,90",
    image: "/placeholder.png"
  },
  {
    id: 3,
    title: "A Moreninha",
    author: "Joaquim Manuel de Macedo",
    price: "35,90",
    image: "/placeholder.png"
  },
  {
    id: 4,
    title: "Iracema",
    author: "José de Alencar",
    price: "42,90",
    image: "/placeholder.png"
  },
  {
    id: 5,
    title: "O Guarani",
    author: "José de Alencar",
    price: "48,90",
    image: "/placeholder.png"
  },
  {
    id: 6,
    title: "Senhora",
    author: "José de Alencar",
    price: "44,90",
    image: "/placeholder.png"
  }
];
