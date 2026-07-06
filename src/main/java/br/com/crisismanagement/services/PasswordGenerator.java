package br.com.crisismanagement.services;

import java.security.SecureRandom;

/** Gera senhas temporárias aleatórias razoavelmente fortes. */
final class PasswordGenerator {

    private static final String UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijkmnpqrstuvwxyz";
    private static final String DIGITS = "23456789";
    private static final String SYMBOLS = "!@#$%&*";
    private static final String ALL = UPPER + LOWER + DIGITS + SYMBOLS;
    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordGenerator() {
    }

    static String generate() {
        int length = 12;
        StringBuilder sb = new StringBuilder(length);
        // Garante ao menos um de cada classe.
        sb.append(pick(UPPER));
        sb.append(pick(LOWER));
        sb.append(pick(DIGITS));
        sb.append(pick(SYMBOLS));
        for (int i = sb.length(); i < length; i++) {
            sb.append(pick(ALL));
        }
        return shuffle(sb);
    }

    private static char pick(String source) {
        return source.charAt(RANDOM.nextInt(source.length()));
    }

    private static String shuffle(StringBuilder sb) {
        for (int i = sb.length() - 1; i > 0; i--) {
            int j = RANDOM.nextInt(i + 1);
            char tmp = sb.charAt(i);
            sb.setCharAt(i, sb.charAt(j));
            sb.setCharAt(j, tmp);
        }
        return sb.toString();
    }
}
