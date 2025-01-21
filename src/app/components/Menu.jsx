import Link from "next/link";
import Image from "next/image";
import '@fortawesome/fontawesome-free/css/all.min.css';


const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/images/home.png",
        label: "Home",
        url: "/Home",
      },
      {
        icon: "/images/note.png",
        label: "Dashboard",
        url: "/MainDashboard",
      },
      {
        icon: "/images/setting.png",
        label: "Setting",
        url: "/Setting",
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2 text-zinc-500" key={i.title}>
          <span className="hidden lg:block text-zinc-500 font-light my-4 ml-2">
            {i.title}
          </span>
          {i.items.map((item) => (
            <Link
              href={item.url}
              key={item.label}
              className="flex items-center justify-center lg:justify-start gap-4 text-zinc-500 py-2 ml-2"
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
