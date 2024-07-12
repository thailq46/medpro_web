import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import clsx from "clsx";
import {Fragment} from "react";
import styles from "./Breadcrumb.module.scss";

interface IBreadcrumbProps {
  items: {label: string; href?: string; isActive?: boolean}[];
  classNames?: string;
}

export default function BreadcrumbGlobal({
  items,
  classNames = "",
}: IBreadcrumbProps) {
  return (
    <div className={clsx(styles.wrapper, classNames)}>
      <div className={styles.container}>
        <Breadcrumb className={styles.breadcrumbs}>
          <BreadcrumbList>
            {items.map((item, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={item.href || "#"}
                    className={clsx(
                      styles.breadcrumbLink,
                      item.isActive && styles.activeLink
                    )}
                  >
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
