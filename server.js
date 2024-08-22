import axios from "axios";
import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/pokemon/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemon = response.data;

        // Fetch species data to get the evolution chain URL
        const speciesResponse = await axios.get(pokemon.species.url);
        const species = speciesResponse.data;

        // Fetch evolution chain data
        const evolutionChainResponse = await axios.get(species.evolution_chain.url);
        const evolutionChain = evolutionChainResponse.data.chain;

        // Extract evolution data
        const evolutionPath = [];
        let currentEvolution = evolutionChain;
        while (currentEvolution) {
            evolutionPath.push(currentEvolution.species.name);
            currentEvolution = currentEvolution.evolves_to[0];
        }

        const data = {
            name: pokemon.name,
            hp: pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat,
            attack: pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat,
            defense: pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat,
            speed: pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat,
            types: pokemon.types.map(typeInfo => typeInfo.type.name),
            sprite: pokemon.sprites.front_default,
            evolution: evolutionPath.join(' -> ') 
        };

        res.json(data);
    } catch (error) {
        console.error("Failed to fetch data:", error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
