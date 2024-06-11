"use client";
import {CameraIcon} from "@/components/Icon";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toBase64} from "@/lib/utils";
import Image from "next/image";
import {useRef} from "react";
import styles from "./AvatarUpload.module.scss";

type AvatarUploadProps = {
  value?: string;
  onChange?: (value?: string) => void;
};

export function AvatarUpload({value, onChange}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64 = (await toBase64(file)) as string;
      onChange?.(base64);
    }
  };
  return (
    <div className={styles.container}>
      <Avatar className="w-full h-full">
        <AvatarImage src={value} className="object-cover" />
        <AvatarFallback className="bg-secondary">
          <Image
            src="/img/avatar/avatar.jpg"
            alt="Avatar"
            width={500}
            height={500}
          />
        </AvatarFallback>
      </Avatar>
      <Button
        variant="ghost"
        size="icon"
        className={styles.btn}
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
        }}
      >
        <CameraIcon className="w-5 h-5" />
      </Button>
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="image/*"
      />
    </div>
  );
}
