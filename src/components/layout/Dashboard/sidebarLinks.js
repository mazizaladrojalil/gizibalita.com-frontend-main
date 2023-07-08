import { BsPersonLinesFill, BsTextRight } from 'react-icons/bs';
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
