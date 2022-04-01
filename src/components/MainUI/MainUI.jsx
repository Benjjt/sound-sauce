import "./main-ui.scss";
import ReactiveCanvasOne from "../ReactiveCanvasOne/ReactiveCanvasOne";
import { ControlPannel } from "../ControlPannel/ControlPannel";

export default function MainUI() {
  return (
    <div className="main-ui">
      <ControlPannel />
      <ReactiveCanvasOne />
    </div>
  );
}
