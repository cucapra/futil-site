import Prism from 'prismjs';

Prism.languages.futil = {
    'diff-addition': {
        pattern: /^\+.*$/m
    },
    'diff-deletion': {
        pattern: /^-.*$/m
    },
    'comment': Prism.languages.clike.comment,
    'string': {
        pattern: /(["])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
    }, 'toplevel': {
        pattern: /\b(?:extern|component)\b/,
        lookbehind: true,
    },
    'segments': {
        pattern: /\b(?:cells|wires|control)\b/,
        lookbehind: true,
    },
    'operators': {
        pattern: /\b(?:prim|group|seq|par|if|while|with)\b/,
        lookbehind: true,
    },
    'number': [
        {
            pattern: /\b[0-9]+'b[0-1]+\b/
        },
        {
            pattern: /\b[0-9]+'d[0-9]+\b/
        },
        {
            pattern: /\b[0-9]+'x[0-9A-Fa-f]+\b/
        },
        {
            pattern: /\b[0-9]+'o[0-7]+\b/
        },
        {
            pattern: /\b(?:[0-9]+)(?!')\b/
        }
    ],
};
