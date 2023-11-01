import { useCallback, useState } from "react";
import "./index.scss";
import { collectCode } from "../../document/code/playground";
import { SESSION_KEY } from "../utils";
import { useLocale } from "../../hooks";
import { Button } from "../../ui/atoms/button";

function PQEntry({ element, key }: { element: HTMLInputElement; key: number }) {
  const header = element.parentElement?.parentElement;
  const intoView = () => {
    const top =
      (header?.getBoundingClientRect().top || 0) + window.scrollY - 130;
    window.scrollTo({ top, behavior: "smooth" });
  };
  const lang = header?.firstChild?.textContent;
  return (
    <li key={key}>
      <button className="queue-ref" onClick={intoView}>
        Example {key + 1}
      </button>
      <code>{lang}</code>
      <Button
        type="action"
        buttonType="reset"
        icon="trash"
        onClickHandler={() => element.click()}
      />
    </li>
  );
}

export function PlayQueue({ standalone = false }: { standalone?: boolean }) {
  const locale = useLocale();
  const [queue, setQueue] = useState<HTMLInputElement[]>([]);
  const cb = useCallback(() => {
    const elements = [
      ...document.querySelectorAll(".playlist > input:checked"),
    ] as HTMLInputElement[];
    setQueue(elements);
  }, [setQueue]);
  window["playQueue"] = cb;
  return queue.length ? (
    <div className={`play-queue-container ${standalone ? "standalone" : ""}`}>
      <aside>
        <details className="play-queue" open>
          <summary>
            <div>Queue</div>
            <Button
              buttonType="reset"
              icon="cancel"
              type="action"
              onClickHandler={() => queue.forEach((e) => e.click())}
            ></Button>
          </summary>
          <div className="play-queue-inner">
            <ul>{queue.map((el, key) => PQEntry({ element: el, key }))}</ul>
            <Button
              type="secondary"
              extraClasses="play-button"
              onClickHandler={(e) => {
                const code = collectCode();
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(code));
                const url = new URL(window?.location.href);
                url.pathname = `/${locale}/play`;
                url.hash = "";
                url.search = "";
                window.open(url, "_blank");
              }}
            >
              PLAY
            </Button>
          </div>
        </details>
      </aside>
    </div>
  ) : null;
}