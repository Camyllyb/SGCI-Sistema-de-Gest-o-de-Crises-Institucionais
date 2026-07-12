package br.com.crisismanagement.services;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.com.crisismanagement.dto.AcaoCriseRequest;
import br.com.crisismanagement.dto.AcaoCriseResponse;
import br.com.crisismanagement.dto.CriseRequest;
import br.com.crisismanagement.dto.CriseResponse;
import br.com.crisismanagement.entities.AcaoCrise;
import br.com.crisismanagement.entities.Crise;
import br.com.crisismanagement.entities.User;
import br.com.crisismanagement.entities.enums.PerfilUsuario;
import br.com.crisismanagement.entities.enums.StatusCrise;
import br.com.crisismanagement.repositories.AcaoCriseRepository;
import br.com.crisismanagement.repositories.CampusRepository;
import br.com.crisismanagement.repositories.CenarioCriseRepository;
import br.com.crisismanagement.repositories.CriseRepository;
import br.com.crisismanagement.repositories.DepartamentoRepository;
import br.com.crisismanagement.repositories.TipoCriseRepository;
import br.com.crisismanagement.repositories.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class CriseService {

    @Inject
    CriseRepository criseRepository;

    @Inject
    AcaoCriseRepository acaoCriseRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    TipoCriseRepository tipoCriseRepository;

    @Inject
    CampusRepository campusRepository;

    @Inject
    CenarioCriseRepository cenarioCriseRepository;

    @Inject
    DepartamentoRepository departamentoRepository;

    @Inject
    JsonWebToken jsonWebToken;

    /**
     * Lista as crises visiveis ao usuario autenticado: o ADMIN enxerga todas; o
     * usuario COMUM enxerga apenas as que ele mesmo cadastrou.
     */
    public List<CriseResponse> listAll() {
        User atual = usuarioAtual();
        List<Crise> crises = atual.perfil == PerfilUsuario.COMUM
                ? criseRepository.listByCreator(atual.id)
                : criseRepository.listAllOrdered();

        Map<Long, String> nomes = nomesUsuarios(crises.stream().map(c -> c.createdBy).toList());
        return crises.stream()
                .map(c -> CriseResponse.from(c, nomes.get(c.createdBy)))
                .toList();
    }

    public CriseResponse findById(Long id) {
        Crise crise = getAcessivel(id);
        return CriseResponse.from(crise, nomeUsuario(crise.createdBy));
    }

    @Transactional
    public CriseResponse create(CriseRequest request) {
        validarReferencias(request);
        User autor = usuarioAtual();

        Crise crise = new Crise();
        crise.titulo = request.titulo();
        crise.descricao = request.descricao();
        crise.nivel = request.nivel();
        crise.tipoCriseId = request.tipoCriseId();
        crise.campusId = request.campusId();
        crise.cenarioId = request.cenarioId();
        crise.departamentoId = request.departamentoId();
        crise.createdBy = autor.id;
        crise.status = StatusCrise.ABERTA;
        crise.active = true;
        crise.createdAt = LocalDateTime.now();
        criseRepository.persist(crise);
        return CriseResponse.from(crise, autor.name);
    }

    @Transactional
    public CriseResponse changeStatus(Long id, StatusCrise novoStatus) {
        Crise crise = getOrThrow(id);
        if (crise.status == StatusCrise.ENCERRADA) {
            throw new BadRequestException("Não é possível alterar o status de uma crise encerrada.");
        }
        crise.status = novoStatus;
        return CriseResponse.from(crise, nomeUsuario(crise.createdBy));
    }

    public List<AcaoCriseResponse> listAcoes(Long criseId) {
        getAcessivel(criseId);
        List<AcaoCrise> acoes = acaoCriseRepository.listByCrise(criseId);
        Map<Long, String> nomes = nomesUsuarios(acoes.stream().map(a -> a.usuarioId).toList());
        return acoes.stream()
                .map(a -> AcaoCriseResponse.from(a, nomes.get(a.usuarioId)))
                .toList();
    }

    @Transactional
    public AcaoCriseResponse addAcao(Long criseId, AcaoCriseRequest request) {
        Crise crise = getAcessivel(criseId);
        User autor = usuarioAtual();

        // Regra de negócio: o usuário COMUM só pode atuar em crises do seu departamento.
        if (autor.perfil == PerfilUsuario.COMUM && !crise.departamentoId.equals(autor.departamentoId)) {
            throw new ForbiddenException("Você só pode registrar ações em crises do seu departamento.");
        }

        AcaoCrise acao = new AcaoCrise();
        acao.descricao = request.descricao();
        acao.tipo = request.tipo();
        acao.criseId = crise.id;
        acao.usuarioId = autor.id;
        acao.createdAt = LocalDateTime.now();
        acaoCriseRepository.persist(acao);
        return AcaoCriseResponse.from(acao, autor.name);
    }

    /**
     * Valida que as referências informadas existem antes de persistir, evitando
     * que um ID inválido estoure uma ConstraintViolationException (HTTP 500 com
     * stack trace). Retorna erro 400 com mensagem clara para o campo faltante.
     */
    private void validarReferencias(CriseRequest request) {
        if (tipoCriseRepository.findByIdOptional(request.tipoCriseId()).isEmpty()) {
            throw new BadRequestException("Tipo de crise informado não existe.");
        }
        if (campusRepository.findByIdOptional(request.campusId()).isEmpty()) {
            throw new BadRequestException("Campus informado não existe.");
        }
        if (request.cenarioId() != null
                && cenarioCriseRepository.findByIdOptional(request.cenarioId()).isEmpty()) {
            throw new BadRequestException("Cenário informado não existe.");
        }
        if (departamentoRepository.findByIdOptional(request.departamentoId()).isEmpty()) {
            throw new BadRequestException("Departamento informado não existe.");
        }
    }

    private Crise getOrThrow(Long id) {
        return criseRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Crise não encontrada: " + id));
    }

    /**
     * Carrega a crise garantindo que o usuário COMUM só acesse as próprias. O
     * ADMIN acessa qualquer crise.
     */
    private Crise getAcessivel(Long id) {
        Crise crise = getOrThrow(id);
        User atual = usuarioAtual();
        if (atual.perfil == PerfilUsuario.COMUM && !atual.id.equals(crise.createdBy)) {
            throw new ForbiddenException("Você não tem acesso a esta crise.");
        }
        return crise;
    }

    private User usuarioAtual() {
        Long id = Long.valueOf(jsonWebToken.getSubject());
        return userRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Usuário autenticado não encontrado."));
    }

    private String nomeUsuario(Long id) {
        if (id == null) {
            return null;
        }
        return userRepository.findByIdOptional(id).map(u -> u.name).orElse(null);
    }

    /**
     * Resolve, em uma única consulta, o nome de todos os usuários informados.
     * Retorna um {@link HashMap} (tolerante a chave nula) porque crises anteriores
     * à V10 têm {@code createdBy} nulo e são consultadas por {@code get(null)}.
     */
    private Map<Long, String> nomesUsuarios(Collection<Long> ids) {
        List<Long> distintos = ids.stream().filter(Objects::nonNull).distinct().toList();
        if (distintos.isEmpty()) {
            return new HashMap<>();
        }
        return userRepository.list("id in ?1", distintos).stream()
                .collect(Collectors.toMap(u -> u.id, u -> u.name, (a, b) -> a, HashMap::new));
    }
}
