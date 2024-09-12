import { atom } from "jotai";

export const ImageFiles = atom<any>([]);
export const ImageData = atom<any[]>([]);
export const isGenerateKey = atom<any>(false);
// export const isSpinner = atom<any>(false);

ImageData.debugLabel = "ImageData";
isGenerateKey.debugLabel = "isGenerateKey";
ImageFiles.debugLabel = "ImageFiles";
// isSpinner.debugLabel = "isSpinner";
