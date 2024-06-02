/* eslint-disable @next/next/no-img-element */
import React from "react";
import {Button} from "@/components/ui/button";

export default function LoginSocial() {
  return (
    <div className="mt-10 flex flex-col justify-center items-center gap-3">
      <h3 className="text-center text-sm">Hoặc đăng nhập bằng tài khoản</h3>
      <Button className="w-full py-7 !bg-[#ef5252]">
        <div className="!w-[230px] flex items-center">
          <img
            srcSet="/img/google_icon.png 2x"
            alt="google"
            className="w-7 h-7 object-cover flex-shrink-0 mr-3"
          />
          <span className="uppercase font-normal">Đăng nhập với Google</span>
        </div>
      </Button>
      <Button className="w-full py-7 !bg-[#293688]">
        <div className="!w-[230px] flex items-center">
          <img
            srcSet="/img/facebook_icon.png 2x"
            alt="facebook"
            className="w-7 h-7 object-cover flex-shrink-0 mr-3"
          />
          <span className="uppercase font-normal">Đăng nhập với Facebook</span>
        </div>
      </Button>
    </div>
  );
}
