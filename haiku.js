function CreateHaiku() {
    format = [5, 7, 5]
    for(var i = 0; i < 3; i++) {
        document.getElementById(`haiku${i+1}`).innerHTML = CreateLine(format[i])
    }
}

function CreateLine(syllables) {
    const determiners = [
        [
            "the", "a", "this", "that", "my", "your", "his", "her",
            "its", "our", "their", "some", "each", "both", "these",
            "those", "all", "one", "no"
        ],
        [
            "any", "either", "neither", "another",
            "many", "several", "certain", "various",
            "every"
        ],
        [
            "individual", "particular"
        ]
    ];

    const adjectives = [
        [
            "bright", "strong", "quick", "sharp", "smooth", "small", "brave", "fresh",
            "dark", "cold", "soft", "sweet", "fast", "kind", "rough", "clear",
            "loud", "calm", "short", "long", "wide", "thin", "thick", "warm",
            "dry", "wet", "new", "old", "young", "plain", "clean"
        ],
        [
            "happy", "silent", "graceful", "tiny", "golden", "ancient", "lucky",
            "gentle", "massive", "silver", "fearless", "rapid", "simple", "clever",
            "mellow", "patient", "pretty", "shining", "humble", "fancy",
            "steady", "tragic", "vivid", "wild"
        ],
        [
            "mysterious", "beautiful", "dangerous", "energetic", "colorful", "marvelous",
            "incredible", "fantastic", "wonderful", "courageous", "harmonious",
            "delicate", "impossible", "curious", "victorious", "glorious",
            "elegant", "radiant", "magnificent", "anxious"
        ]
    ];

    const nouns = [
        [
            "sky", "stone", "bird", "cloud", "tree", "lamp", "field",
            "wind", "grass", "star", "dream", "flame", "breeze", "path",
            "wolf", "bear", "fish", "voice", "song", "trail", "snow",
            "storm", "wave", "dawn", "dust"
        ],
        [
            "river", "mountain", "ocean", "forest", "candle", "meadow",
            "shadow", "valley", "harbor", "garden", "planet", "castle",
            "thunder", "whisper", "dragon", "village", "blossom",
            "journey", "sunset", "winter", "summer", "prairie", "echo"
        ],
        [
            "harmony", "butterfly", "adventure", "instrument", "photograph",
            "discovery", "accident", "mystery", "identity", "character",
            "universe", "imagination", "opportunity", "destination",
            "creature", "phenomenon", "equality", "tragedy", "memory",
            "elegance", "happiness", "certainty"
        ]
    ];

    const verbs = [
        [
            "runs", "jumps", "walks", "pushes", "pulls", "sings", "grows",
            "stands", "falls", "turns", "stays", "moves", "swims", "shines",
            "breaks", "drinks", "speaks", "drives", "makes", "sleeps", "writes"
        ],
        [
            "follows", "carries", "whispers", "answers", "wanders",
            "covers", "manages", "happens", "changes", "searches",
            "chooses", "enters", "opens", "closes", "hurries",
            "shivers", "chases", "reaches"
        ],
        [
            "celebrates", "encounters", "discovers", "illuminates",
            "confiscates", "rearranges", "entertains", "reconsider",
            "demonstrates"
        ]
    ];

    const adverbs = [
        [
            "fast", "hard", "tight", "right", "straight", "soon", "late"
        ],
        [
            "slowly", "brightly", "softly", "quickly", "quietly",
            "warmly", "sweetly", "deeply", "highly", "nearly"
        ],
        [
            "carefully", "certainly", "elegantly", "silently",
            "gracefully", "honestly", "beautifully", "suddenly"
        ]
    ];

    const prepositions = [
        [
            "to", "of", "by", "for", "from", "with", "at", "on", "in"
        ],
        [
            "into", "under", "over", "after", "before", "within", "without"
        ],
        [
            "beneath", "behind", "alongside"
        ]
    ];


    const types = [
        ["d", "adj", "n", "v", "adv"],
        ["d", "n", "v"],
        ["d", "n", "v", "p", "d", "n"],
        ["adj", "n", "v"],               
        ["d", "n", "v", "adv"],          
        ["n", "v", "adv"],               
        ["d", "adj", "n", "v"],          
        ["d", "n", "v", "d", "n"],       
        ["d", "n", "v", "p", "n"],       
        ["n", "v", "p", "d", "n"],       
        ["d", "adj", "n"],               
        ["d", "n", "v", "adj", "n"],     
        ["d", "n", "adv", "v"],          
        ["adj", "n", "adv", "v"],        
        ["d", "adj", "n", "adv"],        
        ["d", "n", "p", "d", "adj", "n"],
        ["n", "v", "p", "n"],            
        ["d", "n", "v", "p", "d", "adj", "n"],
        ["d", "adj", "n", "v", "p", "n"],
        ["d", "n", "p", "n"]             
    ];


    validTypes = []

    for(var i = 0; i < types.length; i++) {
        if(types[i].length <= syllables) {
            validTypes.push(types[i])
        }
    }
    index = Math.floor(Math.random() * validTypes.length)
    type = validTypes[index]

    // make list of random numbers summing to syllables

    lengths = []
    for(var i = 0; i < type.length; i++) {
        lengths.push(1)
    }

    while(Sum(lengths) < syllables) {
        index = Math.floor(Math.random() * lengths.length)
        if(type[index] != "d" && !(type[index] == "p" && lengths[index] >= 2) && lengths[index] < 3)
            lengths[index] += 1
    }
    for(var i = 0; i < lengths.length; i++) {
        lengths[i] -= 1
    }

    //document.getElementById("test").innerHTML = `${lengths} \n ${type}`

    sentence = ""
    for(var i = 0; i < type.length; i++) {
        word = ""
        console.log(i)
        switch (type[i]) {
            case "d":
                word = PickWord(determiners[lengths[i]])
                break
            case "adj":
                word = PickWord(adjectives[lengths[i]])
                break
            case "n":
                word = PickWord(nouns[lengths[i]])
                break
            case "v":
                word = PickWord(verbs[lengths[i]])
                break
            case "adv":
                word = PickWord(adverbs[lengths[i]])
                break
            case "p":
                word = PickWord(prepositions[lengths[i]])
                break
            default:
                word = "HELP!"
                break
        }
        sentence += `${word} `
    }

    return sentence[0].toUpperCase() + sentence.substring(1)
}

function PickWord(ls) {
    console.log(ls)
    return ls[Math.floor(Math.random() * ls.length)]
}

function Sum(ls) {
    total = 0
    for(var i = 0; i < ls.length; i++) {
        total += ls[i]
    }
    return total
}

function CopyHaiku() {
    var haiku = ""
    for(var i = 0; i < 3; i++) {
        haiku += document.getElementById(`haiku${i+1}`).innerHTML + (i != 2 ? "\n" : "")
        console.log(haiku)
    }

    navigator.clipboard.writeText(haiku)
}

CreateHaiku()