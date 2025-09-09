package com.Manutencao.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public final class PasswordHasher {
    private static final int SALT_BYTES = 16;
    private static final int ITERATIONS = 10000;

    private PasswordHasher() {}

    public static String generateSalt() {
        byte[] salt = new byte[SALT_BYTES];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public static String hash(String plain, String saltB64) {
        try {
            byte[] salt = Base64.getDecoder().decode(saltB64);
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] input = concat(plain.getBytes(StandardCharsets.UTF_8), salt);
            byte[] digest = md.digest(input);

            for (int i = 1; i < ITERATIONS; i++) {
                md.reset();
                digest = md.digest(concat(digest, salt));
            }
            return Base64.getEncoder().encodeToString(digest);
        } catch (Exception e) {
            throw new IllegalStateException("Erro ao hashear senha", e);
        }
    }

    private static byte[] concat(byte[] a, byte[] b) {
        byte[] out = new byte[a.length + b.length];
        System.arraycopy(a, 0, out, 0, a.length);
        System.arraycopy(b, 0, out, a.length, b.length);
        return out;
    }
}