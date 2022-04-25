import { DEVMODE, MOCK_IPC } from "../env"
import { RPC_PASSWORD } from "../__tests__/mocks"
import { setRpcVisualizationRequest, setRpcExpiryMargin, setRpcPassword, setRpcPort, setRpcPostEncryption, setRpcWindowId } from "../redux/reducers/rpc/rpc.actions"
import store from "../redux/store"
import { IPC_VISUALIZE_REQUEST_METHOD, IPC_INIT_MESSAGE, IPC_ORIGIN_DEV, IPC_ORIGIN_PRODUCTION, IPC_PUSH_MESSAGE } from "../utils/constants"
import { setOriginAppId, setOriginAppBuiltin } from "../redux/reducers/origin/origin.actions"

export const handleIpc = async (event) => {
  try {
    if (
      typeof event.data === "string" &&
      ((!DEVMODE && event.origin === IPC_ORIGIN_PRODUCTION) ||
        (DEVMODE && event.origin === IPC_ORIGIN_DEV))
    ) {
      const data = JSON.parse(event.data);

      if (data.type === IPC_INIT_MESSAGE) {
        store.dispatch(setRpcExpiryMargin(data.data.expiry_margin));
        store.dispatch(setRpcPort(data.data.rpc_port));
        store.dispatch(setRpcPostEncryption(data.data.post_encryption));
        store.dispatch(setRpcWindowId(data.data.window_id));

        try {
          if (MOCK_IPC) store.dispatch(setRpcPassword(RPC_PASSWORD));
          else store.dispatch(setRpcPassword(window.bridge.getSecretSync().BuiltinSecret));
        } catch (e) {
          console.error("Error loading api secrets!");
          console.error(e);
          throw e;
        }
      } else if (
        data.type === IPC_PUSH_MESSAGE &&
        data.method === IPC_VISUALIZE_REQUEST_METHOD
      ) {
        store.dispatch(
          setRpcVisualizationRequest({
            request: data.data.request,
          })
        );
        store.dispatch(setOriginAppBuiltin(data.data.origin_app_info.search_builtin));
        store.dispatch(setOriginAppId(data.data.origin_app_info.id));
      }
    } else if (typeof event.data === "string") {
      console.log(`[IPC] recieved event message from unapproved origin (${event.origin}), blocked`);
    }
  } catch(e) {
    console.error(e)
  }
}