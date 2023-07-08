import { BsPersonLinesFill, BsTextRight } from 'react-icons/bs';
import { FaRegPaperPlane } from "react-icons/fa";
export const sidebarlink = [
    {
        title: 'Input Data',
        links: [
            {
                title: 'Desa',
                path: 'desa',
                icon: BsTextRight,
            },
            {
                title: 'Posyandu',
                path: 'posyandu',
                icon: BsTextRight,
            },
            {
                title: 'Artikel',
                path: 'artikel',
                icon: FaRegPaperPlane,
            },
        ],
    },
    {
        title: 'Register Akun',
        links: [
            {
                title: 'Kader Posyandu',
                path: 'kader-posyandu',
                icon: BsPersonLinesFill,
            },
            {
                title: 'Tenaga Kesehatan',
                path: 'tenaga-kesehatan',
                icon: BsPersonLinesFill,
            },
        ],
    },
    
];
