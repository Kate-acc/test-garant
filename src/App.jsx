import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';


import { ConfigProvider } from 'antd';
import ruRU from "antd/lib/locale/ru_RU";

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <ConfigProvider locale={ruRU}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
