import { exec } from "child_process";

export const sleep = async (ms) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

export const shell = async (command) => {
  try {
    return await exec(command);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const clear_data = async (directory) => {
  await shell(`rm -rf ${directory}`);
  await sleep(2000);
  await shell(`mkdir -p ${directory}`);
};
