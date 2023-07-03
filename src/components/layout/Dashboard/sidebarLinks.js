import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { BsPersonLinesFill, BsJournalCheck } from 'react-icons/bs';
import { ImUserTie } from 'react-icons/im';
import { TbReportSearch, TbCash, TbReceipt } from 'react-icons/tb';
import { IoReceiptOutline } from 'react-icons/io5';
import { ROUTES } from '../../../utilities/Routes';

export const sidebarlink = [
    {
        title: 'Main Menu',
        links: [
            {
                title: 'Dashboard',
                path: ROUTES.DASHBOARD,
                icon: MdOutlineSpaceDashboard,
            },
        ],
    },
    {
        title: 'Data Master',
        links: [
            {
                title: 'Pelanggan',
                path: ROUTES.PELANGGAN,
                icon: BsPersonLinesFill,
            },
            {
                title: 'Rekening',
                path: ROUTES.REKENING + '/transfer',
                icon: BsJournalCheck,
            },
        ],
    },
    
];
