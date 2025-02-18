import { createApp, logger, runApp } from "@beamlit/sdk";

createApp()
  .then((app) => runApp(app))
  .catch((err) => logger.error(err));
