import {Button} from "@/components/ui/button";
import Link from "next/link";
import {twMerge} from "tailwind-merge";
import styles from "./Button.module.scss";

interface IButtonProps {
  title: string;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function ButtonGlobal({
  title,
  href = "#",
  className,
  onClick,
}: IButtonProps) {
  const buttonClasses = twMerge(styles.btnGlobal, className);
  if (onClick) {
    return (
      <Button className={buttonClasses} onClick={onClick}>
        {title}
      </Button>
    );
  }
  return (
    <Button className={buttonClasses} asChild>
      <Link href={href}>{title}</Link>
    </Button>
  );
}

export function ButtonViewDetail({title, href = "#", className}: IButtonProps) {
  return (
    <Button className={twMerge(styles.btnViewDetail, className)} asChild>
      <Link href={href}>{title}</Link>
    </Button>
  );
}
