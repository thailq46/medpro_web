"use client";
import {CircleUserIcon, SecurityIcon} from "@/components/Icon";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import AppointmentForm from "@/module/account-management/appointments";
import SecurityForm from "@/module/account-management/security";
import UpdateMeForm from "@/module/account-management/update-me";
import {CalendarIcon} from "@radix-ui/react-icons";
import styles from "./Account.module.scss";

export default function AccountManagement({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={styles.dialogContent}>
        <Tabs defaultValue="account" className={styles.tabContainer}>
          <TabsList className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Account</h2>
            <p className={styles.sidebarDesc}>Manage your account info.</p>
            <TabsTrigger
              value="account"
              className={`${styles.sidebarItem} mt-5`}
            >
              <CircleUserIcon className="w-5 h-5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className={styles.sidebarItem}>
              <SecurityIcon className="w-5 h-5" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appointment" className={styles.sidebarItem}>
              <CalendarIcon className="w-5 h-5" />
              Appointments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className={styles.tabContent}>
            <UpdateMeForm />
          </TabsContent>
          <TabsContent value="security" className={styles.tabContent}>
            <SecurityForm />
          </TabsContent>
          <TabsContent value="appointment" className={styles.tabContent}>
            <AppointmentForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
