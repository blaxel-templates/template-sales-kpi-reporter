import { logger } from "@beamlit/sdk";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { getKnowledgebase } from "./src/knowledgebase";

/**
 * List the file names in a given directory.
 * @param dir - The directory to list files from.
 * @returns An array of file names.
 */
const listFiles = async (dir: string): Promise<string[]> => {
  const files = await fs.readdir(dir);
  return files;
};

const main = async () => {
  try {
    // Define the directory containing your documents.
    const docsDir = "documents";

    // Get a list of file names in the documents folder.
    const fileNames = await listFiles(docsDir);

    // Read each file's content and build a document object.
    const documents = await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(docsDir, fileName);
        const content = await fs.readFile(filePath, "utf-8");
        return {
          id: fileName, // using fileName as an identifier
          content,
        };
      })
    );

    logger.info(
      `Storing the following documents in Qdrant: ${documents
        .map((doc) => doc.id)
        .join(", ")}`
    );

    const knowledgebase = await getKnowledgebase();
    await Promise.all(
      documents.map(async (doc) => {
        await knowledgebase.add(randomUUID(), doc.content, {
          documentName: doc.id,
        });
      })
    );
    logger.info("Documents successfully stored in Qdrant.");
  } catch (error) {
    logger.error(`Error storing documents in Qdrant: ${error}`);
  }
};

main();
