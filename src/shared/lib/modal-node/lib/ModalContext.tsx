"use client";

import { createContext } from "react";

import { ModalContextValue } from "../model";

export const ModalContext = createContext<ModalContextValue | undefined>(
    undefined,
);
