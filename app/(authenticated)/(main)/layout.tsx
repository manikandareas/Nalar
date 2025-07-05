import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FC } from "react";


interface IMainLayoutProps extends React.PropsWithChildren { };

const MainLayout: FC<IMainLayoutProps> = (props) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {props.children}
            </SidebarInset>
        </SidebarProvider>
    );
}

export default MainLayout