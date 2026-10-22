import { useState, useEffect } from "react";
import Card from "./Card.jsx";

function App() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // TAREFA 5: Estado de erro

  useEffect(() => {
    fetch("http://localhost:3000/api/cartas")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`); // TAREFA 5: Lança erro se o status não for ok (ex: 404)
        }
        return res.json();
      })
      .then((data) => setCards(data))
      .catch((err) => setError(err.message)) // TAREFA 5: Apanha o erro
      .finally(() => setLoading(false));
  }, []);

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  function pickRandom() {
    if (cards.length > 0) {
      setRandomCard(cards[Math.floor(Math.random() * cards.length)]);
    }
  }

  return (
    <main>
      <h1>A minha coleção</h1>

      {/* TAREFA 5: Mostrar mensagem de erro se falhar */}
      {error ? (
        <p style={{ color: "red" }}>Erro ao carregar: {error}</p>
      ) : loading ? (
        <p>A carregar…</p>
      ) : (
        <>
          <p>
            Tenho {cards.length} cartas · a mostrar {visible.length}
          </p>

          <div>
            <button onClick={() => setFilter("Todas")}>Todas</button>
            <button onClick={() => setFilter("Criatura")}>Só criaturas</button>
            <button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
            <button onClick={() => setSorted(!sorted)}>
              {sorted ? "Ordem original" : "Ordenar por ataque"}
            </button>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar pelo nome…"
          />

          {visible.length === 0 ? (
            <p>Nenhuma carta corresponde.</p>
          ) : (
            <ul>
              {visible.map((card) => (
                <Card key={card.name} {...card} />
              ))}
            </ul>
          )}

          <h2>Carta à sorte</h2>
          <button onClick={pickRandom}>Escolher outra</button>
          {randomCard && (
            <p>
              <b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack} ·
              defesa {randomCard.defense}
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default App;