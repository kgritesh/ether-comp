export function serializeAccount(acc) {
  return {
    id: acc.id,
    email: acc.email,
    provider: acc.provider,
    active: acc.active,
    etherAccount: acc.etherAccount
  };
}
